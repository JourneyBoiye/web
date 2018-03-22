let _CANNONICAL_MAP = {
    'usa': 'united states',
    'united states of america': 'united states',
    'uk': 'united kingdom',
    'united kingdom of great britain and northern ireland': 'united kingdom',
    'the bahamas': 'bahamas',
    'myanmar (burma)': 'myanmar',
    'czechia': 'czech republic',
    'macedonia (fyrom)': 'macedonia',
    'cabo verde': 'cape verde',
    'democratic people\'s republic of korea': 'north korea',
    'congo': 'republic of the congo',
    'democratic republic of the congo': 'the democratic republic of the congo',
    'russian federation': 'russia',
    'united republic of tanzania': 'tanzania',
    'viet nam': 'vietnam',
    'venezuela (bolivarian republic of)': 'venezuela',
    'korea': 'south korea',
    'republic of korea': 'south korea',
    'republic of moldova': 'moldova',
    'iran (islamic republic of)': 'iran',
    'bolivia (plurinational state of)': 'bolivia',
    'lao people\'s democratic republic': 'laos',
    'syrian arab republic': 'syria',
    'tfyr of macedonia': 'macedonia',
    'china hong kong sar': 'hong kong',
    'china, hong kong sar': 'hong kong',
    'china macao sar': 'macao',
    'china, macao sar': 'macao',
    'macau': 'macao',
    'state of palestine': 'palestine',
    'republic of south sudan': 'south sudan',
    'brunei darussalam': 'brunei',
    'faeroe islands': 'faroe islands',
    'federated states of micronesia': 'micronesia',
    'wallis and futuna islands': 'wallis and futuna',
    'saint helena ex. dep.': 'saint helena',
    'curacao': 'curaçao',
    'saint barthelemy': 'saint barthélemy',
    'são tomé': 'sao tome and principe',
    'são tomé and príncipe': 'sao tome and principe',
    'east timor': 'timor-leste',
    'ivory coast': 'côte d\'ivoire',
    'vatican city': 'holy see',
    'u.s. virgin islands': 'united states virgin islands',
    'pitcairn islands': 'pitcairn',
    'saint martin': 'sint maarten',
    'reunion': 'réunion',
    'saint helena, ascension and tristan da cunha': 'saint helena',
}

export function normalizer(name) {
  let lc = name.toLocaleLowerCase();
	if (lc in _CANNONICAL_MAP) {
		return _CANNONICAL_MAP[lc];
	}

	return lc;
}
