import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects = InferSubjects<any> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

    if (user.roles?.includes('super_admin')) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      user.permissions?.forEach((permission: string) => {
        // Permission format: "subject.action", e.g. "teacher.create"
        const [subjectRaw, actionRaw] = permission.split('.');
        
        // Map action
        let mappedAction: Action;
        switch(actionRaw) {
          case 'create': mappedAction = Action.Create; break;
          case 'read': mappedAction = Action.Read; break;
          case 'view': mappedAction = Action.Read; break; // Map view to read
          case 'update': mappedAction = Action.Update; break;
          case 'edit': mappedAction = Action.Update; break; // Map edit to update
          case 'delete': mappedAction = Action.Delete; break;
          default: mappedAction = Action.Manage; // Or handle unknown actions carefully
        }
        
        // Use lowercase subject to match permission string
        // Or capitalize to match Class name if we were using classes
        // Let's stick to the string from permission for consistency
        can(mappedAction, subjectRaw);
      });
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
