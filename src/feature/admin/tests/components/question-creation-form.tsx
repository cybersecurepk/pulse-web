"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface QuestionCreationFormProps {
  onAddQuestion: () => void;
  isEditing: boolean;
  onCancelEdit: () => void;
}

export function QuestionCreationForm({
  onAddQuestion,
  isEditing,
  onCancelEdit,
}: QuestionCreationFormProps) {
  const form = useFormContext();

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    name: "currentQuestion.options",
    control: form.control,
  });

  const currentQuestion = form.watch("currentQuestion");
  const questions = form.watch("questions");
  const nextQuestionNumber = questions.length + 1;

  const addOption = () => {
    appendOption({ text: "", isCorrect: false });
  };

  const updateOption = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const currentOptions = form.getValues("currentQuestion.options");

    if (field === "isCorrect" && value === true) {
      // Only one correct answer allowed
      const updatedOptions = currentOptions.map((option: { text: string; isCorrect: boolean }, i: number) => ({
        ...option,
        isCorrect: i === index,
      }));
      form.setValue("currentQuestion.options", updatedOptions);
    } else {
      form.setValue(`currentQuestion.options.${index}.${field}`, value);
    }
  };

  const resetCurrentQuestion = () => {
    form.setValue("currentQuestion", {
      text: "",
      points: 5,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  };

  const handleCancel = () => {
    resetCurrentQuestion();
    onCancelEdit();
  };

  return (
    <div className="space-y-4">
      <Field.Textarea
        name="currentQuestion.text"
        label="Question Text"
        placeholder="Enter your question here"
        required
      />

      <Field.Text
        name="currentQuestion.points"
        label="Points"
        type="number"
        placeholder="5"
        className="w-24"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Answer Options
        </label>
        {optionFields.map((field, index) => (
          <div key={field.id}>
            <div className="flex items-center space-x-2">
              <input
                value={currentQuestion?.options?.[index]?.text || ""}
                onChange={(e) => updateOption(index, "text", e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={
                    currentQuestion?.options?.[index]?.isCorrect || false
                  }
                  onChange={(e) =>
                    updateOption(index, "isCorrect", e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <label className="text-sm">Correct</label>
              </div>
              
              {optionFields.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {(form.formState.errors.currentQuestion as { options?: Array<{ text?: { message?: string } }> })?.options?.[index]
              ?.text && (
              <p className="text-red-500 text-sm">
                {
                  (form.formState.errors.currentQuestion as { options?: Array<{ text?: { message?: string } }> })?.options?.[index]
                    ?.text?.message
                }
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Option Button */}
      <Button
        onClick={addOption}
        variant="outline"
        className="w-full"
        type="button"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Option
      </Button>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={onAddQuestion} className="flex-1" type="button">
          <Plus className="h-4 w-4 mr-2" />
          {isEditing ? "Update Question" : `Add Question ${nextQuestionNumber}`}
        </Button>

        {isEditing && (
          <Button onClick={handleCancel} variant="outline" type="button">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
