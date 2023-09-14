const currency = {
    USD: { symbol: '$', country: 'United States', currencyName: 'US Dollar' },
    EUR: { symbol: '€', country: 'European Union', currencyName: 'Euro' },
    AED: { symbol: 'د.إ', country: 'United Arab Emirates', currencyName: 'UAE Dirham' },
    ARS: { symbol: '$', country: 'Argentina', currencyName: 'Argentine Peso' },
    AUD: { symbol: '$', country: 'Australia', currencyName: 'Australian Dollar' },
    BRL: { symbol: 'R$', country: 'Brazil', currencyName: 'Brazilian Real' },
    CAD: { symbol: '$', country: 'Canada', currencyName: 'Canadian Dollar' },
    CHF: { symbol: 'Fr', country: 'Switzerland', currencyName: 'Swiss Franc' },
    CLP: { symbol: '$', country: 'Chile', currencyName: 'Chilean Peso' },
    CNY: { symbol: '¥', country: 'China', currencyName: 'Chinese Yuan' },
    CZK: { symbol: 'Kč', country: 'Czech Republic', currencyName: 'Czech Koruna' },
    DKK: { symbol: 'kr', country: 'Denmark', currencyName: 'Danish Krone' },
    EGP: { symbol: '£', country: 'Egypt', currencyName: 'Egyptian Pound' },
    GBP: { symbol: '£', country: 'United Kingdom', currencyName: 'British Pound Sterling' },
    HKD: { symbol: '$', country: 'Hong Kong', currencyName: 'Hong Kong Dollar' },
    HUF: { symbol: 'Ft', country: 'Hungary', currencyName: 'Hungarian Forint' },
    IDR: { symbol: 'Rp', country: 'Indonesia', currencyName: 'Indonesian Rupiah' },
    ILS: { symbol: '₪', country: 'Israel', currencyName: 'Israeli New Shekel' },
    INR: { symbol: '₹', country: 'India', currencyName: 'Indian Rupee' },
    JPY: { symbol: '¥', country: 'Japan', currencyName: 'Japanese Yen' },
    KRW: { symbol: '₩', country: 'South Korea', currencyName: 'South Korean Won' },
    MXN: { symbol: '$', country: 'Mexico', currencyName: 'Mexican Peso' },
    MYR: { symbol: 'RM', country: 'Malaysia', currencyName: 'Malaysian Ringgit' },
    NOK: { symbol: 'kr', country: 'Norway', currencyName: 'Norwegian Krone' },
    NZD: { symbol: '$', country: 'New Zealand', currencyName: 'New Zealand Dollar' },
    PHP: { symbol: '₱', country: 'Philippines', currencyName: 'Philippine Peso' },
    PKR: { symbol: '₨', country: 'Pakistan', currencyName: 'Pakistani Rupee' },
    PLN: { symbol: 'zł', country: 'Poland', currencyName: 'Polish Złoty' },
    RUB: { symbol: '₽', country: 'Russia', currencyName: 'Russian Ruble' },
    SAR: { symbol: '﷼', country: 'Saudi Arabia', currencyName: 'Saudi Riyal' },
    SEK: { symbol: 'kr', country: 'Sweden', currencyName: 'Swedish Krona' },
    SGD: { symbol: '$', country: 'Singapore', currencyName: 'Singapore Dollar' },
    THB: { symbol: '฿', country: 'Thailand', currencyName: 'Thai Baht' },
    TRY: { symbol: '₺', country: 'Turkey', currencyName: 'Turkish Lira' },
    TWD: { symbol: 'NT$', country: 'Taiwan', currencyName: 'New Taiwan Dollar' },
    UAH: { symbol: '₴', country: 'Ukraine', currencyName: 'Ukrainian Hryvnia' },
    VND: { symbol: '₫', country: 'Vietnam', currencyName: 'Vietnamese Dong' },
    ZAR: { symbol: 'R', country: 'South Africa', currencyName: 'South African Rand' },
    // Add more currencies as needed
};

export default class CurrencySymbolConvert {
    async getCurrencySymbol(unit: string) {
        return currency[unit as keyof typeof currency] || null;
    }
}