function getCountryFromAutocomplete(autocomplete) {
  let place = autocomplete.getPlace();
  let country = '';

  if (place !== undefined && place !== null) {
    let lastIndex = place.address_components.length - 1;
    let lastComponent = place.address_components[lastIndex]

    for (let i = 0; i < lastComponent.types.length; i++) {
      let type = lastComponent.types[i];
      if (type === 'country') {
        country = lastComponent.long_name;
        break;
      }
    }
  }

  return country;
}

export { getCountryFromAutocomplete };
