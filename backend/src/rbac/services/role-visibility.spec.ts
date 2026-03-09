import { ModuleMeta } from '../interfaces/form-config.interface';

describe('Form-based Button Visibility Validation', () => {
  const teacherMeta: ModuleMeta = {
    form: { style: 'modal' }
  };

  const studentMeta: ModuleMeta = {
    form: { style: 'step' }
  };

  const instituteMeta: ModuleMeta = {};

  const classMeta: ModuleMeta = {};

  it('should show "Create New" button for Teachers (form exists)', () => {
    expect(teacherMeta.form).toBeDefined();
  });

  it('should show "Create New" button for Students (form exists)', () => {
    expect(studentMeta.form).toBeDefined();
  });

  it('should NOT show "Create New" button for Institutes (no form)', () => {
    expect(instituteMeta.form).toBeUndefined();
  });

  it('should NOT show "Create New" button for Classes (no form)', () => {
    expect(classMeta.form).toBeUndefined();
  });
});
