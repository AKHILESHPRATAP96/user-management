export default function leadFormValidator(formData) {
  let isValid = true;
  let errors = {};

  if (formData.source.trim() === "") {
    isValid = false;
    errors.source = "Source is required";
  }
  if (formData.leadType.trim() === "") {
    isValid = false;
    errors.leadType = "Lead type is required";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.email)) {
    isValid = false;
    errors.email = "Invalid email address";
  }

  if (!Array.isArray(formData.attachment) || formData.attachment.length === 0) {
    isValid = false;
    errors.attachment = "Attachment is required";
  }

  return { isValid, errors };
}
