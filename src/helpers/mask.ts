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

const phoneNumber = (input: string) => {
  input = input.replace(/\D/g, '');
  input = input.replace(/^(\d)/, '($1');
  input = input.replace(/^(\(\d{2})(\d)/, '$1) $2');
  input = input.replace(/(\d{5})(\d{1,5})/, '$1-$2');
  input = input.replace(/(-\d{4})\d+?$/, '$1');

  return input;
};

export const mask = {
  onlyNumbers,
  currency,
  phoneNumber,
};
