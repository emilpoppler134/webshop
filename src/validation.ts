import { ref } from 'vue';

interface IForm {
  email: string;
  name: string;
  country: string;
  line1: string;
  postal_code: string;
  city: string;
  phone: string;
  cc_name: string;
  cc_number: string;
  cc_exp: string;
  cc_csc: string;
}

export const form = ref<IForm>({
  email: "",
  name: "",
  country: "SE",
  line1: "",
  postal_code: "",
  city: "",
  phone: "",
  cc_name: "",
  cc_number: "",
  cc_exp: "",
  cc_csc: ""
});

export const emailValidation = ref({
  invalid: false,
  message: "Invalid email address."
});

export const validation = ref({
  invalid: false,
  message: "Invalid input."
});

export function validateEmail(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  const validation = String(value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  if (!validation) {
    emailValidation.value.invalid = true;
  } else {
    emailValidation.value.invalid = false;
  }
}

export function formatCCNumberInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  const unformattedValue = input.value.replace(/\s/g, ''); // Remove existing spaces

  // Format as xxxx xxxx xxxx xxxx
  const formattedValue = unformattedValue
    .replace(/\D/g, '') // Remove non-numeric characters
    .replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 characters except the last group

  form.value.cc_number = formattedValue;
  input.value = form.value.cc_number;
}

export function formatCCExpInput (event: Event): void {
  const input = event.target as HTMLInputElement;
  let unformattedValue = input.value.replace(/[^0-9]/g, '');

  if (unformattedValue.length > 4) {
    unformattedValue = unformattedValue.substr(0, 4);
  }

  if (unformattedValue.length > 2) {
    const mm = unformattedValue.substr(0, 2);
    const yy = unformattedValue.substr(2);
    unformattedValue = `${mm} / ${yy}`;
  }

  form.value.cc_exp = unformattedValue;
  input.value = form.value.cc_exp;
};