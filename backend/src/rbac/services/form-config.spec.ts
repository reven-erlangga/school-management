import { FormConfig, ModuleMeta } from '../interfaces/form-config.interface';

describe('Form Configuration Validation', () => {
  it('should validate a valid Teacher form configuration', () => {
    const teacherForm: FormConfig = {
      style: 'modal',
      title: 'Add New Teacher',
      subtitle: 'Fill in the information',
      content: [
        {
          type: 'textfield',
          label: 'Full Name',
          placeholder: 'Enter full name',
          validation: { required: true },
        },
        {
          type: 'dropdown',
          label: 'Subject',
          options: [{ label: 'Math', value: 'math' }],
        },
      ],
      condition: {
        status: 'success',
        showAfter: 2000,
        feedbackType: 'toast message',
        message: 'Success!',
      },
    };

    expect(teacherForm.style).toBe('modal');
    expect(teacherForm.content?.length).toBe(2);
    expect(teacherForm.condition?.status).toBe('success');
  });

  it('should validate a valid Student form configuration', () => {
    const studentForm: FormConfig = {
      style: 'step',
      title: 'Enroll New Student',
      content: [
        { type: 'textfield', label: 'First Name' },
        { type: 'file', label: 'Documents' },
      ],
    };

    expect(studentForm.style).toBe('step');
    expect(studentForm.content?.[1].type).toBe('file');
  });

  it('should handle optional fields gracefully', () => {
    const minimalForm: FormConfig = {
      content: [{ type: 'textfield' }],
    };

    expect(minimalForm.style).toBeUndefined();
    expect(minimalForm.title).toBeUndefined();
    expect(minimalForm.content?.[0].label).toBeUndefined();
  });

  it('should validate ModuleMeta with form', () => {
    const teacherMeta: ModuleMeta = {
      form: { style: 'modal' },
    };

    const instituteMeta: ModuleMeta = {};

    expect(teacherMeta.form).toBeDefined();
    expect(instituteMeta.form).toBeUndefined();
  });
});
