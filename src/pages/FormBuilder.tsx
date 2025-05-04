import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: unknown;
  validation?: Record<string, unknown>;
}

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone Number" },
  { value: "select", label: "Dropdown Select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Buttons" },
  { value: "date", label: "Date Picker" },
  { value: "time", label: "Time Picker" },
  { value: "file", label: "File Upload" },
];

const FormBuilder: React.FC = () => {
  const { id } = useParams();
  const { forms, addForm, updateForm } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: "",
    name: "New Form",
    description: "Form description",
    fields: [] as FormField[],
    createdBy: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  // Load form if editing
  useEffect(() => {
    if (id) {
      const existingForm = forms.find((f) => f.id === id);
      if (existingForm) {
        setForm(existingForm);
      } else {
        navigate("/forms");
        addToast("Form not found", "error");
      }
    }
  }, [id, forms, navigate, addToast]);

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      name: `field${form.fields.length + 1}`,
      label: `Field ${form.fields.length + 1}`,
      type: "text",
      required: false,
      placeholder: "",
    };

    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    setSelectedFieldIndex(form.fields.length);
  };

  const deleteField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));

    setSelectedFieldIndex(null);
  };

  const duplicateField = (index: number) => {
    const fieldToDuplicate = form.fields[index];
    const duplicatedField: FormField = {
      ...fieldToDuplicate,
      id: crypto.randomUUID(),
      name: `${fieldToDuplicate.name}_copy`,
      label: `${fieldToDuplicate.label} (Copy)`,
    };

    const newFields = [...form.fields];
    newFields.splice(index + 1, 0, duplicatedField);

    setForm((prev) => ({
      ...prev,
      fields: newFields,
    }));

    setSelectedFieldIndex(index + 1);
  };

  const moveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === form.fields.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newFields = [...form.fields];
    const field = newFields[index];

    newFields.splice(index, 1);
    newFields.splice(newIndex, 0, field);

    setForm((prev) => ({
      ...prev,
      fields: newFields,
    }));

    setSelectedFieldIndex(newIndex);
  };

  const updateFieldProperty = (
    index: number,
    property: string,
    value: unknown
  ) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, [property]: value } : field
      ),
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newFields = [...form.fields];
    const [reorderedField] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, reorderedField);

    setForm((prev) => ({
      ...prev,
      fields: newFields,
    }));

    if (selectedFieldIndex !== null) {
      if (selectedFieldIndex === result.source.index) {
        setSelectedFieldIndex(result.destination.index);
      } else if (
        selectedFieldIndex > result.source.index &&
        selectedFieldIndex <= result.destination.index
      ) {
        setSelectedFieldIndex(selectedFieldIndex - 1);
      } else if (
        selectedFieldIndex < result.source.index &&
        selectedFieldIndex >= result.destination.index
      ) {
        setSelectedFieldIndex(selectedFieldIndex + 1);
      }
    }
  };

  const saveForm = () => {
    if (id) {
      // Update existing form
      updateForm(id, form);
      addToast("Form updated successfully", "success");
    } else {
      // Create new form
      const newForm = addForm(form);
      navigate(`/forms/${newForm.id}`);
      addToast("Form created successfully", "success");
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with controls */}
      <header className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="mr-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/forms")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
            <p className="text-gray-500">{form.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            className="btn btn-outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Edit Form" : "Preview Form"}
          </button>
          <button className="btn btn-primary" onClick={saveForm}>
            <Save className="h-5 w-5" />
            Save Form
          </button>
        </div>
      </header>

      {showPreview ? (
        <div className="flex-1 bg-white border rounded-lg p-6 overflow-auto">
          <h2 className="text-xl font-bold mb-6">{form.name}</h2>
          <p className="text-gray-600 mb-8">{form.description}</p>

          {form.fields.map((field) => (
            <div key={field.id} className="mb-6">
              <label
                className={`block text-sm font-medium mb-2 ${
                  field.required
                    ? 'after:content-["*"] after:ml-0.5 after:text-error-500'
                    : ""
                }`}
              >
                {field.label}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  className="form-input"
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  className="form-textarea"
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  className="form-input"
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === "email" && (
                <input
                  type="email"
                  className="form-input"
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === "tel" && (
                <input
                  type="tel"
                  className="form-input"
                  placeholder={field.placeholder}
                  disabled
                />
              )}

              {field.type === "select" && (
                <select className="form-select" disabled>
                  <option value="" disabled>
                    Select an option
                  </option>
                  {field.options?.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    disabled
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {field.label}
                  </span>
                </div>
              )}

              {field.type === "radio" && (
                <div className="space-y-2">
                  {field.options?.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        disabled
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {option}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {field.type === "date" && (
                <input type="date" className="form-input" disabled />
              )}

              {field.type === "time" && (
                <input type="time" className="form-input" disabled />
              )}

              {field.type === "file" && (
                <input type="file" className="form-input" disabled />
              )}
            </div>
          ))}

          <div className="mt-8 flex justify-end">
            <button className="btn btn-primary" disabled>
              Submit Form
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex space-x-4">
          {/* Fields List */}
          <div className="w-1/3 bg-white border rounded-lg overflow-auto">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Form Fields</h2>
                <button className="btn btn-sm btn-primary" onClick={addField}>
                  <Plus className="h-4 w-4" />
                  Add Field
                </button>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-2"
                  >
                    {form.fields.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No fields added yet. Click "Add Field" to start building
                        your form.
                      </div>
                    ) : (
                      form.fields.map((field, index) => (
                        <Draggable
                          key={field.id}
                          draggableId={field.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 p-3 rounded-md border cursor-pointer hover:bg-gray-50
                                ${
                                  selectedFieldIndex === index
                                    ? "border-primary-500 bg-primary-50"
                                    : "border-gray-200"
                                }
                              `}
                              onClick={() => setSelectedFieldIndex(index)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">
                                    {field.label}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {fieldTypes.find(
                                      (type) => type.value === field.type
                                    )?.label || field.type}
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    className="p-1 rounded hover:bg-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveField(index, "up");
                                    }}
                                    disabled={index === 0}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="p-1 rounded hover:bg-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      moveField(index, "down");
                                    }}
                                    disabled={index === form.fields.length - 1}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="p-1 rounded hover:bg-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateField(index);
                                    }}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="p-1 rounded hover:bg-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteField(index);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-error-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Field properties */}
          <div className="w-2/3 bg-white border rounded-lg overflow-auto">
            {selectedFieldIndex !== null && form.fields[selectedFieldIndex] ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Field Properties</h2>
                  <button
                    className="text-gray-500 hover:text-error-500"
                    onClick={() => setSelectedFieldIndex(null)}
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="form-label">Field Label</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.fields[selectedFieldIndex].label}
                        onChange={(e) =>
                          updateFieldProperty(
                            selectedFieldIndex,
                            "label",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-control">
                      <label className="form-label">Field Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={form.fields[selectedFieldIndex].name}
                        onChange={(e) =>
                          updateFieldProperty(
                            selectedFieldIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        Used for form submission (no spaces, lowercase)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="form-label">Field Type</label>
                      <select
                        className="form-select"
                        value={form.fields[selectedFieldIndex].type}
                        onChange={(e) =>
                          updateFieldProperty(
                            selectedFieldIndex,
                            "type",
                            e.target.value
                          )
                        }
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={form.fields[selectedFieldIndex].required}
                          onChange={(e) =>
                            updateFieldProperty(
                              selectedFieldIndex,
                              "required",
                              e.target.checked
                            )
                          }
                        />
                        <span className="ml-2">Required Field</span>
                      </label>
                    </div>
                  </div>

                  {["text", "textarea", "email", "tel", "number"].includes(
                    form.fields[selectedFieldIndex].type
                  ) && (
                    <div className="form-control">
                      <label className="form-label">Placeholder</label>
                      <input
                        type="text"
                        className="form-input"
                        value={
                          form.fields[selectedFieldIndex].placeholder || ""
                        }
                        onChange={(e) =>
                          updateFieldProperty(
                            selectedFieldIndex,
                            "placeholder",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}

                  {["select", "radio", "checkbox"].includes(
                    form.fields[selectedFieldIndex].type
                  ) && (
                    <div className="form-control">
                      <label className="form-label">Options</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Enter each option on a new line"
                        value={(
                          form.fields[selectedFieldIndex].options || []
                        ).join("\n")}
                        onChange={(e) =>
                          updateFieldProperty(
                            selectedFieldIndex,
                            "options",
                            e.target.value
                              .split("\n")
                              .filter((option) => option.trim() !== "")
                          )
                        }
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        Enter each option on a new line
                      </span>
                    </div>
                  )}

                  {["number"].includes(
                    form.fields[selectedFieldIndex].type
                  ) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="form-label">Min Value</label>
                        <input
                          type="number"
                          className="form-input"
                          value={
                            form.fields[selectedFieldIndex].validation?.min as string | number ||
                            ""
                          }
                          onChange={(e) => {
                            const validation =
                              form.fields[selectedFieldIndex].validation || {};
                            updateFieldProperty(
                              selectedFieldIndex,
                              "validation",
                              {
                                ...validation,
                                min: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              }
                            );
                          }}
                        />
                      </div>

                      <div className="form-control">
                        <label className="form-label">Max Value</label>
                        <input
                          type="number"
                          className="form-input"
                          value={
                            form.fields[selectedFieldIndex].validation?.max as string | number ||
                            ""
                          }
                          onChange={(e) => {
                            const validation =
                              form.fields[selectedFieldIndex].validation || {};
                            updateFieldProperty(
                              selectedFieldIndex,
                              "validation",
                              {
                                ...validation,
                                max: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              }
                            );
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Settings className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Form Properties
                </h3>

                <div className="w-full max-w-md space-y-4 mt-6">
                  <div className="form-control">
                    <label className="form-label">Form Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="form-label">Form Description</label>
                    <textarea
                      className="form-textarea"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-8 text-gray-500">
                  {form.fields.length === 0 ? (
                    <p>
                      Start by adding fields to your form from the panel on the
                      left.
                    </p>
                  ) : (
                    <p>Select a field from the list to edit its properties.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
