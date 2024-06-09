const onlyNumbers = (input: string) => {
  input = input.replace(/\D/g, '');

  return input;
};

const currency = (input: string) => {
  input = input.replace(/\D/g, '');

  if (input === '') return input;

  const inputAsInt = parseInt(input);

  let formattedValue = (inputAsInt / 100).toFixed(2).replace('.', ',');

  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return formattedValue;
};

export const mask = {
  onlyNumbers,
  currency,
};
