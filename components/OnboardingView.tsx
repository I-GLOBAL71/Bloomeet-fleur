
import * as React from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { SparklesIcon, HeartIcon, CameraIcon, PlusIcon, TrashIcon, CheckIcon, PartyPopperIcon, LightbulbIcon, SearchIcon, ChevronDownIcon, XIcon, GlobeIcon, LoaderIcon } from './Icons';
import { useTranslation } from '../contexts/LanguageContext';

// --- DATA & TYPES ---

type Country = { name: string; code: string; dial_code: string; flag: string; };

const countries: Country[] = [
    { name: 'Afghanistan', code: 'AF', dial_code: '+93', flag: '🇦🇫' }, { name: 'Åland Islands', code: 'AX', dial_code: '+358', flag: '🇦🇽' },
    { name: 'Albania', code: 'AL', dial_code: '+355', flag: '🇦🇱' }, { name: 'Algeria', code: 'DZ', dial_code: '+213', flag: '🇩🇿' },
    { name: 'American Samoa', code: 'AS', dial_code: '+1684', flag: '🇦🇸' }, { name: 'Andorra', code: 'AD', dial_code: '+376', flag: '🇦🇩' },
    { name: 'Angola', code: 'AO', dial_code: '+244', flag: '🇦🇴' }, { name: 'Anguilla', code: 'AI', dial_code: '+1264', flag: '🇦🇮' },
    { name: 'Antarctica', code: 'AQ', dial_code: '+672', flag: '🇦🇶' }, { name: 'Antigua and Barbuda', code: 'AG', dial_code: '+1268', flag: '🇦🇬' },
    { name: 'Argentina', code: 'AR', dial_code: '+54', flag: '🇦🇷' }, { name: 'Armenia', code: 'AM', dial_code: '+374', flag: '🇦🇲' },
    { name: 'Aruba', code: 'AW', dial_code: '+297', flag: '🇦🇼' }, { name: 'Australia', code: 'AU', dial_code: '+61', flag: '🇦🇺' },
    { name: 'Austria', code: 'AT', dial_code: '+43', flag: '🇦🇹' }, { name: 'Azerbaijan', code: 'AZ', dial_code: '+994', flag: '🇦🇿' },
    { name: 'Bahamas', code: 'BS', dial_code: '+1242', flag: '🇧🇸' }, { name: 'Bahrain', code: 'BH', dial_code: '+973', flag: '🇧🇭' },
    { name: 'Bangladesh', code: 'BD', dial_code: '+880', flag: '🇧🇩' }, { name: 'Barbados', code: 'BB', dial_code: '+1246', flag: '🇧🇧' },
    { name: 'Belarus', code: 'BY', dial_code: '+375', flag: '🇧🇾' }, { name: 'Belgium', code: 'BE', dial_code: '+32', flag: '🇧🇪' },
    { name: 'Belize', code: 'BZ', dial_code: '+501', flag: '🇧🇿' }, { name: 'Benin', code: 'BJ', dial_code: '+229', flag: '🇧🇯' },
    { name: 'Bermuda', code: 'BM', dial_code: '+1441', flag: '🇧🇲' }, { name: 'Bhutan', code: 'BT', dial_code: '+975', flag: '🇧🇹' },
    { name: 'Bolivia', code: 'BO', dial_code: '+591', flag: '🇧🇴' }, { name: 'Bosnia and Herzegovina', code: 'BA', dial_code: '+387', flag: '🇧🇦' },
    { name: 'Botswana', code: 'BW', dial_code: '+267', flag: '🇧🇼' }, { name: 'Brazil', code: 'BR', dial_code: '+55', flag: '🇧🇷' },
    { name: 'British Indian Ocean Territory', code: 'IO', dial_code: '+246', flag: '🇮🇴' }, { name: 'Brunei Darussalam', code: 'BN', dial_code: '+673', flag: '🇧🇳' },
    { name: 'Bulgaria', code: 'BG', dial_code: '+359', flag: '🇧🇬' }, { name: 'Burkina Faso', code: 'BF', dial_code: '+226', flag: '🇧🇫' },
    { name: 'Burundi', code: 'BI', dial_code: '+257', flag: '🇧🇮' }, { name: 'Cambodia', code: 'KH', dial_code: '+855', flag: '🇰🇭' },
    { name: 'Cameroon', code: 'CM', dial_code: '+237', flag: '🇨🇲' }, { name: 'Canada', code: 'CA', dial_code: '+1', flag: '🇨🇦' },
    { name: 'Cape Verde', code: 'CV', dial_code: '+238', flag: '🇨🇻' }, { name: 'Cayman Islands', code: 'KY', dial_code: '+345', flag: '🇰🇾' },
    { name: 'Central African Republic', code: 'CF', dial_code: '+236', flag: '🇨🇫' }, { name: 'Chad', code: 'TD', dial_code: '+235', flag: '🇹🇩' },
    { name: 'Chile', code: 'CL', dial_code: '+56', flag: '🇨🇱' }, { name: 'China', code: 'CN', dial_code: '+86', flag: '🇨🇳' },
    { name: 'Christmas Island', code: 'CX', dial_code: '+61', flag: '🇨🇽' }, { name: 'Cocos (Keeling) Islands', code: 'CC', dial_code: '+61', flag: '🇨🇨' },
    { name: 'Colombia', code: 'CO', dial_code: '+57', flag: '🇨🇴' }, { name: 'Comoros', code: 'KM', dial_code: '+269', flag: '🇰🇲' },
    { name: 'Congo', code: 'CG', dial_code: '+242', flag: '🇨🇬' }, { name: 'Congo, The Democratic Republic of the', code: 'CD', dial_code: '+243', flag: '🇨🇩' },
    { name: 'Cook Islands', code: 'CK', dial_code: '+682', flag: '🇨🇰' }, { name: 'Costa Rica', code: 'CR', dial_code: '+506', flag: '🇨🇷' },
    { name: 'Cote d\'Ivoire', code: 'CI', dial_code: '+225', flag: '🇨🇮' }, { name: 'Croatia', code: 'HR', dial_code: '+385', flag: '🇭🇷' },
    { name: 'Cuba', code: 'CU', dial_code: '+53', flag: '🇨🇺' }, { name: 'Cyprus', code: 'CY', dial_code: '+357', flag: '🇨🇾' },
    { name: 'Czech Republic', code: 'CZ', dial_code: '+420', flag: '🇨🇿' }, { name: 'Denmark', code: 'DK', dial_code: '+45', flag: '🇩🇰' },
    { name: 'Djibouti', code: 'DJ', dial_code: '+253', flag: '🇩🇯' }, { name: 'Dominica', code: 'DM', dial_code: '+1767', flag: '🇩🇲' },
    { name: 'Dominican Republic', code: 'DO', dial_code: '+1849', flag: '🇩🇴' }, { name: 'Ecuador', code: 'EC', dial_code: '+593', flag: '🇪🇨' },
    { name: 'Egypt', code: 'EG', dial_code: '+20', flag: '🇪🇬' }, { name: 'El Salvador', code: 'SV', dial_code: '+503', flag: '🇸🇻' },
    { name: 'Equatorial Guinea', code: 'GQ', dial_code: '+240', flag: '🇬🇶' }, { name: 'Eritrea', code: 'ER', dial_code: '+291', flag: '🇪🇷' },
    { name: 'Estonia', code: 'EE', dial_code: '+372', flag: '🇪🇪' }, { name: 'Ethiopia', code: 'ET', dial_code: '+251', flag: '🇪🇹' },
    { name: 'Falkland Islands (Malvinas)', code: 'FK', dial_code: '+500', flag: '🇫🇰' }, { name: 'Faroe Islands', code: 'FO', dial_code: '+298', flag: '🇫🇴' },
    { name: 'Fiji', code: 'FJ', dial_code: '+679', flag: '🇫🇯' }, { name: 'Finland', code: 'FI', dial_code: '+358', flag: '🇫🇮' },
    { name: 'France', code: 'FR', dial_code: '+33', flag: '🇫🇷' }, { name: 'French Guiana', code: 'GF', dial_code: '+594', flag: '🇬🇫' },
    { name: 'French Polynesia', code: 'PF', dial_code: '+689', flag: '🇵🇫' }, { name: 'Gabon', code: 'GA', dial_code: '+241', flag: '🇬🇦' },
    { name: 'Gambia', code: 'GM', dial_code: '+220', flag: '🇬🇲' }, { name: 'Georgia', code: 'GE', dial_code: '+995', flag: '🇬🇪' },
    { name: 'Germany', code: 'DE', dial_code: '+49', flag: '🇩🇪' }, { name: 'Ghana', code: 'GH', dial_code: '+233', flag: '🇬🇭' },
    { name: 'Gibraltar', code: 'GI', dial_code: '+350', flag: '🇬🇮' }, { name: 'Greece', code: 'GR', dial_code: '+30', flag: '🇬🇷' },
    { name: 'Greenland', code: 'GL', dial_code: '+299', flag: '🇬🇱' }, { name: 'Grenada', code: 'GD', dial_code: '+1473', flag: '🇬🇩' },
    { name: 'Guadeloupe', code: 'GP', dial_code: '+590', flag: '🇬🇵' }, { name: 'Guam', code: 'GU', dial_code: '+1671', flag: '🇬🇺' },
    { name: 'Guatemala', code: 'GT', dial_code: '+502', flag: '🇬🇹' }, { name: 'Guernsey', code: 'GG', dial_code: '+44', flag: '🇬🇬' },
    { name: 'Guinea', code: 'GN', dial_code: '+224', flag: '🇬🇳' }, { name: 'Guinea-Bissau', code: 'GW', dial_code: '+245', flag: '🇬🇼' },
    { name: 'Guyana', code: 'GY', dial_code: '+592', flag: '🇬🇾' }, { name: 'Haiti', code: 'HT', dial_code: '+509', flag: '🇭🇹' },
    { name: 'Holy See (Vatican City State)', code: 'VA', dial_code: '+379', flag: '🇻🇦' }, { name: 'Honduras', code: 'HN', dial_code: '+504', flag: '🇭🇳' },
    { name: 'Hong Kong', code: 'HK', dial_code: '+852', flag: '🇭🇰' }, { name: 'Hungary', code: 'HU', dial_code: '+36', flag: '🇭🇺' },
    { name: 'Iceland', code: 'IS', dial_code: '+354', flag: '🇮🇸' }, { name: 'India', code: 'IN', dial_code: '+91', flag: '🇮🇳' },
    { name: 'Indonesia', code: 'ID', dial_code: '+62', flag: '🇮🇩' }, { name: 'Iran, Islamic Republic of', code: 'IR', dial_code: '+98', flag: '🇮🇷' },
    { name: 'Iraq', code: 'IQ', dial_code: '+964', flag: '🇮🇶' }, { name: 'Ireland', code: 'IE', dial_code: '+353', flag: '🇮🇪' },
    { name: 'Isle of Man', code: 'IM', dial_code: '+44', flag: '🇮🇲' }, { name: 'Israel', code: 'IL', dial_code: '+972', flag: '🇮🇱' },
    { name: 'Italy', code: 'IT', dial_code: '+39', flag: '🇮🇹' }, { name: 'Jamaica', code: 'JM', dial_code: '+1876', flag: '🇯🇲' },
    { name: 'Japan', code: 'JP', dial_code: '+81', flag: '🇯🇵' }, { name: 'Jersey', code: 'JE', dial_code: '+44', flag: '🇯🇪' },
    { name: 'Jordan', code: 'JO', dial_code: '+962', flag: '🇯🇴' }, { name: 'Kazakhstan', code: 'KZ', dial_code: '+7', flag: '🇰🇿' },
    { name: 'Kenya', code: 'KE', dial_code: '+254', flag: '🇰🇪' }, { name: 'Kiribati', code: 'KI', dial_code: '+686', flag: '🇰🇮' },
    { name: 'Korea, Democratic People\'s Republic of', code: 'KP', dial_code: '+850', flag: '🇰🇵' }, { name: 'Korea, Republic of', code: 'KR', dial_code: '+82', flag: '🇰🇷' },
    { name: 'Kosovo', code: 'XK', dial_code: '+383', flag: '🇽🇰' }, { name: 'Kuwait', code: 'KW', dial_code: '+965', flag: '🇰🇼' },
    { name: 'Kyrgyzstan', code: 'KG', dial_code: '+996', flag: '🇰🇬' }, { name: 'Lao People\'s Democratic Republic', code: 'LA', dial_code: '+856', flag: '🇱🇦' },
    { name: 'Latvia', code: 'LV', dial_code: '+371', flag: '🇱🇻' }, { name: 'Lebanon', code: 'LB', dial_code: '+961', flag: '🇱🇧' },
    { name: 'Lesotho', code: 'LS', dial_code: '+266', flag: '🇱🇸' }, { name: 'Liberia', code: 'LR', dial_code: '+231', flag: '🇱🇷' },
    { name: 'Libyan Arab Jamahiriya', code: 'LY', dial_code: '+218', flag: '🇱🇾' }, { name: 'Liechtenstein', code: 'LI', dial_code: '+423', flag: '🇱🇮' },
    { name: 'Lithuania', code: 'LT', dial_code: '+370', flag: '🇱🇹' }, { name: 'Luxembourg', code: 'LU', dial_code: '+352', flag: '🇱🇺' },
    { name: 'Macao', code: 'MO', dial_code: '+853', flag: '🇲🇴' }, { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK', dial_code: '+389', flag: '🇲🇰' },
    { name: 'Madagascar', code: 'MG', dial_code: '+261', flag: '🇲🇬' }, { name: 'Malawi', code: 'MW', dial_code: '+265', flag: '🇲🇼' },
    { name: 'Malaysia', code: 'MY', dial_code: '+60', flag: '🇲🇾' }, { name: 'Maldives', code: 'MV', dial_code: '+960', flag: '🇲🇻' },
    { name: 'Mali', code: 'ML', dial_code: '+223', flag: '🇲🇱' }, { name: 'Malta', code: 'MT', dial_code: '+356', flag: '🇲🇹' },
    { name: 'Marshall Islands', code: 'MH', dial_code: '+692', flag: '🇲🇭' }, { name: 'Martinique', code: 'MQ', dial_code: '+596', flag: '🇲🇶' },
    { name: 'Mauritania', code: 'MR', dial_code: '+222', flag: '🇲🇷' }, { name: 'Mauritius', code: 'MU', dial_code: '+230', flag: '🇲🇺' },
    { name: 'Mayotte', code: 'YT', dial_code: '+262', flag: '🇾🇹' }, { name: 'Mexico', code: 'MX', dial_code: '+52', flag: '🇲🇽' },
    { name: 'Micronesia, Federated States of', code: 'FM', dial_code: '+691', flag: '🇫🇲' }, { name: 'Moldova, Republic of', code: 'MD', dial_code: '+373', flag: '🇲🇩' },
    { name: 'Monaco', code: 'MC', dial_code: '+377', flag: '🇲🇨' }, { name: 'Mongolia', code: 'MN', dial_code: '+976', flag: '🇲🇳' },
    { name: 'Montenegro', code: 'ME', dial_code: '+382', flag: '🇲🇪' }, { name: 'Montserrat', code: 'MS', dial_code: '+1664', flag: '🇲🇸' },
    { name: 'Morocco', code: 'MA', dial_code: '+212', flag: '🇲🇦' }, { name: 'Mozambique', code: 'MZ', dial_code: '+258', flag: '🇲🇿' },
    { name: 'Myanmar', code: 'MM', dial_code: '+95', flag: '🇲🇲' }, { name: 'Namibia', code: 'NA', dial_code: '+264', flag: '🇳🇦' },
    { name: 'Nauru', code: 'NR', dial_code: '+674', flag: '🇳🇷' }, { name: 'Nepal', code: 'NP', dial_code: '+977', flag: '🇳🇵' },
    { name: 'Netherlands', code: 'NL', dial_code: '+31', flag: '🇳🇱' }, { name: 'Netherlands Antilles', code: 'AN', dial_code: '+599', flag: '🇳🇱' },
    { name: 'New Caledonia', code: 'NC', dial_code: '+687', flag: '🇳🇨' }, { name: 'New Zealand', code: 'NZ', dial_code: '+64', flag: '🇳🇿' },
    { name: 'Nicaragua', code: 'NI', dial_code: '+505', flag: '🇳🇮' }, { name: 'Niger', code: 'NE', dial_code: '+227', flag: '🇳🇪' },
    { name: 'Nigeria', code: 'NG', dial_code: '+234', flag: '🇳🇬' }, { name: 'Niue', code: 'NU', dial_code: '+683', flag: '🇳🇺' },
    { name: 'Norfolk Island', code: 'NF', dial_code: '+672', flag: '🇳🇫' }, { name: 'Northern Mariana Islands', code: 'MP', dial_code: '+1670', flag: '🇲🇵' },
    { name: 'Norway', code: 'NO', dial_code: '+47', flag: '🇳🇴' }, { name: 'Oman', code: 'OM', dial_code: '+968', flag: '🇴🇲' },
    { name: 'Pakistan', code: 'PK', dial_code: '+92', flag: '🇵🇰' }, { name: 'Palau', code: 'PW', dial_code: '+680', flag: '🇵🇼' },
    { name: 'Palestinian Territory, Occupied', code: 'PS', dial_code: '+970', flag: '🇵🇸' }, { name: 'Panama', code: 'PA', dial_code: '+507', flag: '🇵🇦' },
    { name: 'Papua New Guinea', code: 'PG', dial_code: '+675', flag: '🇵🇬' }, { name: 'Paraguay', code: 'PY', dial_code: '+595', flag: '🇵🇾' },
    { name: 'Peru', code: 'PE', dial_code: '+51', flag: '🇵🇪' }, { name: 'Philippines', code: 'PH', dial_code: '+63', flag: '🇵🇭' },
    { name: 'Pitcairn', code: 'PN', dial_code: '+872', flag: '🇵🇳' }, { name: 'Poland', code: 'PL', dial_code: '+48', flag: '🇵🇱' },
    { name: 'Portugal', code: 'PT', dial_code: '+351', flag: '🇵🇹' }, { name: 'Puerto Rico', code: 'PR', dial_code: '+1939', flag: '🇵🇷' },
    { name: 'Qatar', code: 'QA', dial_code: '+974', flag: '🇶🇦' }, { name: 'Romania', code: 'RO', dial_code: '+40', flag: '🇷🇴' },
    { name: 'Russia', code: 'RU', dial_code: '+7', flag: '🇷🇺' }, { name: 'Rwanda', code: 'RW', dial_code: '+250', flag: '🇷🇼' },
    { name: 'Reunion', code: 'RE', dial_code: '+262', flag: '🇷🇪' }, { name: 'Saint Barthelemy', code: 'BL', dial_code: '+590', flag: '🇧🇱' },
    { name: 'Saint Helena', code: 'SH', dial_code: '+290', flag: '🇸🇭' }, { name: 'Saint Kitts and Nevis', code: 'KN', dial_code: '+1869', flag: '🇰🇳' },
    { name: 'Saint Lucia', code: 'LC', dial_code: '+1758', flag: '🇱🇨' }, { name: 'Saint Martin', code: 'MF', dial_code: '+590', flag: '🇲🇫' },
    { name: 'Saint Pierre and Miquelon', code: 'PM', dial_code: '+508', flag: '🇵🇲' }, { name: 'Saint Vincent and the Grenadines', code: 'VC', dial_code: '+1784', flag: '🇻🇨' },
    { name: 'Samoa', code: 'WS', dial_code: '+685', flag: '🇼🇸' }, { name: 'San Marino', code: 'SM', dial_code: '+378', flag: '🇸🇲' },
    { name: 'Sao Tome and Principe', code: 'ST', dial_code: '+239', flag: '🇸🇹' }, { name: 'Saudi Arabia', code: 'SA', dial_code: '+966', flag: '🇸🇦' },
    { name: 'Senegal', code: 'SN', dial_code: '+221', flag: '🇸🇳' }, { name: 'Serbia', code: 'RS', dial_code: '+381', flag: '🇷🇸' },
    { name: 'Seychelles', code: 'SC', dial_code: '+248', flag: '🇸🇨' }, { name: 'Sierra Leone', code: 'SL', dial_code: '+232', flag: '🇸🇱' },
    { name: 'Singapore', code: 'SG', dial_code: '+65', flag: '🇸🇬' }, { name: 'Slovakia', code: 'SK', dial_code: '+421', flag: '🇸🇰' },
    { name: 'Slovenia', code: 'SI', dial_code: '+386', flag: '🇸🇮' }, { name: 'Solomon Islands', code: 'SB', dial_code: '+677', flag: '🇸🇧' },
    { name: 'Somalia', code: 'SO', dial_code: '+252', flag: '🇸🇴' }, { name: 'South Africa', code: 'ZA', dial_code: '+27', flag: '🇿🇦' },
    { name: 'South Georgia and the South Sandwich Islands', code: 'GS', dial_code: '+500', flag: '🇬🇸' }, { name: 'Spain', code: 'ES', dial_code: '+34', flag: '🇪🇸' },
    { name: 'Sri Lanka', code: 'LK', dial_code: '+94', flag: '🇱🇰' }, { name: 'Sudan', code: 'SD', dial_code: '+249', flag: '🇸🇩' },
    { name: 'Suriname', code: 'SR', dial_code: '+597', flag: '🇸🇷' }, { name: 'Svalbard and Jan Mayen', code: 'SJ', dial_code: '+47', flag: '🇸🇯' },
    { name: 'Swaziland', code: 'SZ', dial_code: '+268', flag: '🇸🇿' }, { name: 'Sweden', code: 'SE', dial_code: '+46', flag: '🇸🇪' },
    { name: 'Switzerland', code: 'CH', dial_code: '+41', flag: '🇨🇭' }, { name: 'Syrian Arab Republic', code: 'SY', dial_code: '+963', flag: '🇸🇾' },
    { name: 'Taiwan', code: 'TW', dial_code: '+886', flag: '🇹🇼' }, { name: 'Tajikistan', code: 'TJ', dial_code: '+992', flag: '🇹🇯' },
    { name: 'Tanzania, United Republic of', code: 'TZ', dial_code: '+255', flag: '🇹🇿' }, { name: 'Thailand', code: 'TH', dial_code: '+66', flag: '🇹🇭' },
    { name: 'Timor-Leste', code: 'TL', dial_code: '+670', flag: '🇹🇱' }, { name: 'Togo', code: 'TG', dial_code: '+228', flag: '🇹🇬' },
    { name: 'Tokelau', code: 'TK', dial_code: '+690', flag: '🇹🇰' }, { name: 'Tonga', code: 'TO', dial_code: '+676', flag: '🇹🇴' },
    { name: 'Trinidad and Tobago', code: 'TT', dial_code: '+1868', flag: '🇹🇹' }, { name: 'Tunisia', code: 'TN', dial_code: '+216', flag: '🇹🇳' },
    { name: 'Turkey', code: 'TR', dial_code: '+90', flag: '🇹🇷' }, { name: 'Turkmenistan', code: 'TM', dial_code: '+993', flag: '🇹🇲' },
    { name: 'Turks and Caicos Islands', code: 'TC', dial_code: '+1649', flag: '🇹🇨' }, { name: 'Tuvalu', code: 'TV', dial_code: '+688', flag: '🇹🇻' },
    { name: 'Uganda', code: 'UG', dial_code: '+256', flag: '🇺🇬' }, { name: 'Ukraine', code: 'UA', dial_code: '+380', flag: '🇺🇦' },
    { name: 'United Arab Emirates', code: 'AE', dial_code: '+971', flag: '🇦🇪' }, { name: 'United Kingdom', code: 'GB', dial_code: '+44', flag: '🇬🇧' },
    { name: 'United States', code: 'US', dial_code: '+1', flag: '🇺🇸' }, { name: 'Uruguay', code: 'UY', dial_code: '+598', flag: '🇺🇾' },
    { name: 'Uzbekistan', code: 'UZ', dial_code: '+998', flag: '🇺🇿' }, { name: 'Vanuatu', code: 'VU', dial_code: '+678', flag: '🇻🇺' },
    { name: 'Venezuela', code: 'VE', dial_code: '+58', flag: '🇻🇪' }, { name: 'Vietnam', code: 'VN', dial_code: '+84', flag: '🇻🇳' },
    { name: 'Virgin Islands, British', code: 'VG', dial_code: '+1284', flag: '🇻🇬' }, { name: 'Virgin Islands, U.S.', code: 'VI', dial_code: '+1340', flag: '🇻🇮' },
    { name: 'Wallis and Futuna', code: 'WF', dial_code: '+681', flag: '🇼🇫' }, { name: 'Yemen', code: 'YE', dial_code: '+967', flag: '🇾🇪' },
    { name: 'Zambia', code: 'ZM', dial_code: '+260', flag: '🇿🇲' }, { name: 'Zimbabwe', code: 'ZW', dial_code: '+263', flag: '🇿🇼' }
];

const interests = [
    'Musique', 'Cinéma', 'Voyages', 'Cuisine', 'Sport', 'Lecture', 'Art', 'Danse',
    'Photographie', 'Randonnée', 'Jeux de société', 'Technologie', 'Animaux', 'Nature',
    'Bénévolat', 'Théâtre', 'Concerts', 'Festivals', 'Mode', 'Histoire', 'Politique',
    'Science', 'Philosophie', 'Bricolage', 'Jardinage', 'Yoga', 'Méditation',
    'Langues étrangères', 'Jeux vidéo', 'Écriture'
];

interface ProfileData {
  name: string;
  birthdate: string;
  gender: 'male' | 'female' | 'other' | '';
  orientation: 'straight' | 'gay' | 'bisexual' | 'other' | '';
  city: string;
  photos: { id: number; url: string | null }[];
  bio: string;
  interests: string[];
  phoneNumber: string;
  countryCode: string;
}

const stepVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

// --- SUB-COMPONENTS & HELPERS ---

// Debounce helper function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
    <motion.div
      className="bg-rose-500 h-2 rounded-full"
      initial={{ width: `${(current / total) * 100}%` }}
      animate={{ width: `${((current + 1) / total) * 100}%` }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    />
  </div>
);

const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className="flex flex-col items-center text-center p-8"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <HeartIcon className="w-24 h-24 text-rose-400" />
            <h1 className="font-display text-4xl font-bold mt-6">{t('onboarding.welcome.title')}</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-sm">{t('onboarding.welcome.subtitle')}</p>
            <button
                onClick={onNext}
                className="mt-12 bg-rose-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105"
            >
                {t('onboarding.welcome.cta')}
            </button>
        </motion.div>
    );
};

const NameStep: React.FC<{ onNext: (name: string) => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [name, setName] = React.useState('');
    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.name.title')}</h2>
            <p className="text-gray-500 mt-2">{t('onboarding.name.subtitle')}</p>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboarding.name.placeholder')}
                className="w-full mt-8 p-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
            <button
                onClick={() => onNext(name)}
                disabled={name.length < 2}
                className="w-full mt-6 bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-300 hover:scale-105"
            >
                {t('common.continue')}
            </button>
        </motion.div>
    );
};

const BirthdateStep: React.FC<{ onNext: (date: string) => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [date, setDate] = React.useState('');
    const [age, setAge] = React.useState<number | null>(null);

    const calculateAge = (birthdate: string) => {
        if (!birthdate) return null;
        const today = new Date();
        const birthDate = new Date(birthdate);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        return calculatedAge;
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        setAge(calculateAge(newDate));
    };

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);

    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.birthdate.title')}</h2>
            <p className="text-gray-500 mt-2">{t('onboarding.birthdate.subtitle')}</p>
            <input
                type="date"
                value={date}
                onChange={handleDateChange}
                max={maxDate.toISOString().split("T")[0]}
                className="w-full mt-8 p-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
            />
            {age !== null && (
                 <p className="text-center mt-4 text-gray-600 font-semibold">{t('onboarding.birthdate.age', { age })}</p>
            )}
            <button
                onClick={() => onNext(date)}
                disabled={!date || (age !== null && age < 18)}
                className="w-full mt-6 bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-300 hover:scale-105"
            >
                {t('common.continue')}
            </button>
        </motion.div>
    );
};

const GenderStep: React.FC<{ onNext: (gender: 'male' | 'female' | 'other') => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const options: ('male' | 'female' | 'other')[] = ['male', 'female', 'other'];
    
    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.gender.title')}</h2>
            <div className="mt-8 space-y-4">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => onNext(option)}
                        className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-rose-500 hover:bg-rose-50 transition"
                    >
                        {t(`onboarding.gender.options.${option}`)}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

const OrientationStep: React.FC<{ onNext: (orientation: 'straight' | 'gay' | 'bisexual' | 'other') => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const options: ('straight' | 'gay' | 'bisexual' | 'other')[] = ['straight', 'gay', 'bisexual', 'other'];

    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.orientation.title')}</h2>
            <div className="mt-8 space-y-4">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => onNext(option)}
                        className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-rose-500 hover:bg-rose-50 transition"
                    >
                         {t(`onboarding.orientation.options.${option}`)}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

const CityStep: React.FC<{ onNext: (city: string) => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [city, setCity] = React.useState('');
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const suggestionsRef = React.useRef<HTMLDivElement>(null);
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const fetchSuggestions = React.useCallback(async (searchTerm: string) => {
        if (searchTerm.length < 3) {
            setSuggestions([]);
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const prompt = `You are a geography expert specializing in African localities.
A user is searching for a city, village, or locality in Africa.
Their current input is "${searchTerm}".
Provide a list of up to 7 matching place names in Africa, including their country.
Prioritize well-known cities but also include smaller villages if the search term is specific.
For example, for "Ouaga", you might return ["Ouagadougou, Burkina Faso"].
For "Lag", you might return ["Lagos, Nigeria", "Laghouat, Algeria"].
`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            suggestions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.STRING,
                                    description: "A suggested place name, formatted as 'City, Country' or 'Village, Country'."
                                }
                            }
                        }
                    },
                }
            });
            const responseText = response.text?.trim();
            if (responseText) {
                try {
                    const result = JSON.parse(responseText);
                    setSuggestions(result.suggestions || []);
                } catch(parseError) {
                    console.error("Error parsing city suggestions:", parseError);
                    setError(t('onboarding.city.fetchError'));
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
            }
        } catch (e) {
            console.error("Error fetching city suggestions:", e);
            setError(t('onboarding.city.fetchError'));
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    const debouncedFetch = React.useMemo(() => debounce(fetchSuggestions, 500), [fetchSuggestions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCity(value);
        setShowSuggestions(true);
        debouncedFetch(value);
    };
    
    const handleSelectSuggestion = (suggestion: string) => {
        setCity(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };
    
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.city.title')}</h2>
            <p className="text-gray-500 mt-2">{t('onboarding.city.subtitle')}</p>
            <div className="relative mt-8" ref={suggestionsRef}>
                 <GlobeIcon className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={city}
                    onChange={handleChange}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={t('onboarding.city.placeholder')}
                    className="w-full p-4 pl-14 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                    autoComplete="off"
                />
                {isLoading && <LoaderIcon className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />}
                {showSuggestions && suggestions.length > 0 && (
                    <motion.ul 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border z-10 overflow-hidden"
                    >
                        {suggestions.map((s, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => handleSelectSuggestion(s)}
                                    className="w-full text-left p-4 text-lg hover:bg-gray-100 transition-colors"
                                >
                                    {s}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </div>
             {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <button
                onClick={() => onNext(city)}
                disabled={city.length < 2}
                className="w-full mt-6 bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-300 hover:scale-105"
            >
                {t('common.continue')}
            </button>
        </motion.div>
    );
};

const PhotosStep: React.FC<{ onNext: (photos: { id: number; url: string | null }[]) => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [photos, setPhotos] = React.useState<{ id: number; url: string | null }[]>([
        { id: 1, url: null }, { id: 2, url: null },
        { id: 3, url: null }, { id: 4, url: null },
        { id: 5, url: null }, { id: 6, url: null }
    ]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotos(photos.map(p => p.id === id ? { ...p, url: reader.result as string } : p));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = (id: number) => {
        setPhotos(photos.map(p => p.id === id ? { ...p, url: null } : p));
    };

    const uploadedCount = photos.filter(p => p.url).length;

    return (
         <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.photos.title')}</h2>
            <p className="text-gray-500 mt-2">{t('onboarding.photos.subtitle')}</p>
            <Reorder.Group
                axis="y"
                values={photos}
                onReorder={setPhotos}
                className="grid grid-cols-3 gap-3 mt-6"
            >
                {photos.map((photo, index) => (
                    <Reorder.Item key={photo.id} value={photo} className="aspect-square relative">
                        <label htmlFor={`photo-upload-${photo.id}`} className="cursor-pointer">
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                {photo.url ? (
                                    <img src={photo.url} alt={`Profile photo ${index + 1}`} className="w-full h-full object-cover" />
                                ) : (
                                    <CameraIcon className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            {!photo.url && <div className="absolute bottom-1 right-1 bg-rose-500 rounded-full p-1"><PlusIcon className="w-4 h-4 text-white"/></div>}
                        </label>
                        {photo.url && (
                             <button onClick={() => handleDelete(photo.id)} className="absolute top-1 right-1 bg-black/50 rounded-full p-1"><TrashIcon className="w-4 h-4 text-white"/></button>
                        )}
                        <input id={`photo-upload-${photo.id}`} type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, photo.id)} className="sr-only" />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <button
                onClick={() => onNext(photos)}
                disabled={uploadedCount < 2}
                className="w-full mt-6 bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-300 hover:scale-105"
            >
                {t('common.continue')} ({uploadedCount}/6)
            </button>
        </motion.div>
    );
};

const BioStep: React.FC<{ onNext: (bio: string) => void, profileData: ProfileData }> = ({ onNext, profileData }) => {
    const { t } = useTranslation();
    const [bio, setBio] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [error, setError] = React.useState('');
    
    const handleGenerateBio = async () => {
        setIsGenerating(true);
        setError('');
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const prompt = t('onboarding.bio.aiPrompt', {
                name: profileData.name,
                age: new Date().getFullYear() - new Date(profileData.birthdate).getFullYear(),
                interests: profileData.interests.join(', '),
                city: profileData.city,
                gender: profileData.gender
            });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    maxOutputTokens: 100,
                    temperature: 0.7,
                }
            });

            const generatedBio = response.text?.trim();
            
            if (generatedBio) {
                setBio(generatedBio);
            } else {
                 setError(t('onboarding.bio.aiError'));
            }
        } catch (e) {
            console.error("Error generating bio:", e);
            setError(t('onboarding.bio.aiError'));
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.bio.title')}</h2>
            <p className="text-gray-500 mt-2">{t('onboarding.bio.subtitle')}</p>
            <div className="relative mt-8">
                 <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t('onboarding.bio.placeholder')}
                    className="w-full h-40 p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition resize-none"
                    maxLength={500}
                />
                <span className="absolute bottom-3 right-3 text-sm text-gray-400">{bio.length}/500</span>
            </div>
            <button
                onClick={handleGenerateBio}
                disabled={isGenerating}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-fuchsia-100 text-fuchsia-700 font-bold py-3 rounded-full shadow transition-all hover:bg-fuchsia-200 disabled:opacity-70"
            >
                {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-fuchsia-700 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <SparklesIcon className="w-5 h-5" />
                )}
                {t('onboarding.bio.aiButton')}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
             <button
                onClick={() => onNext(bio)}
                disabled={bio.length < 20}
                className="w-full mt-6 bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-300 hover:scale-105"
            >
                {t('common.continue')}
            </button>
        </motion.div>
    );
};

const InterestsStep: React.FC<{ onNext: (interests: string[]) => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [selected, setSelected] = React.useState<string[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    const toggleInterest = (interest: string) => {
        if (selected.includes(interest)) {
            setSelected(selected.filter(i => i !== interest));
        } else if (selected.length < 5) {
            setSelected([...selected, interest]);
        }
    };
    
    const filteredInterests = interests.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.interests.title')}</h2>
            <p className="text-gray-500 mt-2">{t('onboarding.interests.subtitle', { count: 5 })}</p>
            <div className="relative mt-6">
                <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('onboarding.interests.searchPlaceholder')}
                    className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
            </div>
            <div className="flex flex-wrap gap-3 mt-4 h-48 overflow-y-auto">
                {filteredInterests.map(interest => {
                    const isSelected = selected.includes(interest);
                    return (
                        <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors ${isSelected ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                        >
                            {interest}
                        </button>
                    );
                })}
            </div>
            <button
                onClick={() => onNext(selected)}
                disabled={selected.length < 3}
                className="w-full mt-6 bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-300 hover:scale-105"
            >
                {t('common.continue')} ({selected.length}/5)
            </button>
        </motion.div>
    );
};

const CountryCodePicker: React.FC<{ onSelect: (country: Country) => void; selectedCode: string }> = ({ onSelect, selectedCode }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    const filteredCountries = countries.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dial_code.includes(searchTerm)
    );
    
    const selectedCountry = React.useMemo(() => countries.find(c => c.dial_code === selectedCode), [selectedCode]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg h-full bg-gray-50"
            >
                <span className="text-2xl">{selectedCountry?.flag || '🌍'}</span>
                <ChevronDownIcon className="w-5 h-5 ml-1 text-gray-500"/>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-2 -left-4 w-72 bg-white rounded-lg shadow-lg z-10 border"
                    >
                        <div className="p-2">
                             <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('onboarding.phone.searchCountry')}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                            {filteredCountries.map(country => (
                                <li key={country.code}>
                                    <button
                                        type="button"
                                        onClick={() => { onSelect(country); setIsOpen(false); }}
                                        className="w-full flex items-center gap-3 text-left p-3 hover:bg-gray-100"
                                    >
                                        <span className="text-2xl">{country.flag}</span>
                                        <span className="flex-grow text-gray-800">{country.name}</span>
                                        <span className="text-gray-500">{country.dial_code}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const PhoneStep: React.FC<{ onNext: (phone: string, code: string) => void }> = ({ onNext }) => {
    const { t } = useTranslation();
    const [phone, setPhone] = React.useState('');
    const [countryCode, setCountryCode] = React.useState('+33'); // Default to France
    
    const isValidPhone = React.useMemo(() => /^\d{7,15}$/.test(phone), [phone]);

    const handleContinue = () => {
        if(isValidPhone) {
            onNext(phone, countryCode);
        }
    };

    return (
        <motion.div className="w-full px-8" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
            <h2 className="font-display text-3xl font-bold">{t('onboarding.phone.title')}</h2>
            <p className="text-gray-500 mt-2">{t('onboarding.phone.subtitle')}</p>
            <div className="flex gap-2 mt-8">
                <CountryCodePicker onSelect={(c) => setCountryCode(c.dial_code)} selectedCode={countryCode} />
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="6 12 34 56 78"
                    className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                />
            </div>
            <button
                onClick={handleContinue}
                disabled={!isValidPhone}
                className="w-full mt-6 bg-rose-500 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-300 hover:scale-105"
            >
                {t('common.continue')}
            </button>
        </motion.div>
    );
};

const FinalStep: React.FC<{ onComplete: () => void; name: string }> = ({ onComplete, name }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className="flex flex-col items-center text-center p-8"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <PartyPopperIcon className="w-24 h-24 text-rose-400" />
            <h1 className="font-display text-4xl font-bold mt-6">{t('onboarding.final.title', { name })}</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-sm">{t('onboarding.final.subtitle')}</p>
            <div className="mt-8 p-6 bg-rose-50 border border-rose-200 rounded-xl w-full max-w-sm">
                <div className="flex items-start gap-3">
                    <LightbulbIcon className="w-10 h-10 text-rose-500 flex-shrink-0 mt-1" />
                    <div>
                         <h3 className="font-bold text-lg text-gray-800 text-left">{t('onboarding.final.tipTitle')}</h3>
                         <p className="text-gray-600 text-left mt-1">{t('onboarding.final.tipBody')}</p>
                    </div>
                </div>
            </div>
            <button
                onClick={onComplete}
                className="mt-12 bg-rose-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105"
            >
                {t('onboarding.final.cta')}
            </button>
        </motion.div>
    );
};


// --- MAIN COMPONENT ---

interface OnboardingViewProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [profileData, setProfileData] = React.useState<ProfileData>({
    name: '',
    birthdate: '',
    gender: '',
    orientation: '',
    city: '',
    photos: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, url: null })),
    bio: '',
    interests: [],
    phoneNumber: '',
    countryCode: '+33'
  });
  
  const handleNext = React.useCallback(<T extends keyof ProfileData>(key: T, value: ProfileData[T]) => {
      setProfileData(prev => ({ ...prev, [key]: value }));
      setStep(s => s + 1);
  }, []);

  const totalSteps = 10;

  const renderStep = () => {
    switch (step) {
      case 0: return <WelcomeStep onNext={() => setStep(1)} />;
      case 1: return <NameStep onNext={(name) => handleNext('name', name)} />;
      case 2: return <BirthdateStep onNext={(birthdate) => handleNext('birthdate', birthdate)} />;
      case 3: return <GenderStep onNext={(gender) => handleNext('gender', gender)} />;
      case 4: return <OrientationStep onNext={(orientation) => handleNext('orientation', orientation)} />;
      case 5: return <CityStep onNext={(city) => handleNext('city', city)} />;
      case 6: return <PhotosStep onNext={(photos) => handleNext('photos', photos)} />;
      case 7: return <InterestsStep onNext={(interests) => handleNext('interests', interests)} />;
      case 8: return <BioStep onNext={(bio) => handleNext('bio', bio)} profileData={profileData}/>;
      case 9: return <PhoneStep onNext={(phone, code) => {
          setProfileData(prev => ({ ...prev, phoneNumber: phone, countryCode: code }));
          setStep(s => s + 1);
      }} />;
      case 10: return <FinalStep onComplete={onComplete} name={profileData.name} />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
        {step > 0 && step < totalSteps + 1 && (
            <div className="absolute top-8 w-full max-w-sm px-8">
                 <StepIndicator current={step - 1} total={totalSteps} />
            </div>
        )}
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
    </div>
  );
};

export default OnboardingView;