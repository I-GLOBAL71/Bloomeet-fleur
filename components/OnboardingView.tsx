
import React, { useState, useMemo, useCallback, ChangeEvent } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { SparklesIcon, HeartIcon, CameraIcon, PlusIcon, TrashIcon, CheckIcon, PartyPopperIcon, LightbulbIcon, SearchIcon, ChevronDownIcon, XIcon } from './Icons';

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
    { name: 'Pitcairn', code: 'PN', dial_code: '+870', flag: '🇵🇳' }, { name: 'Poland', code: 'PL', dial_code: '+48', flag: '🇵🇱' },
    { name: 'Portugal', code: 'PT', dial_code: '+351', flag: '🇵🇹' }, { name: 'Puerto Rico', code: 'PR', dial_code: '+1939', flag: '🇵🇷' },
    { name: 'Qatar', code: 'QA', dial_code: '+974', flag: '🇶🇦' }, { name: 'Réunion', code: 'RE', dial_code: '+262', flag: '🇷🇪' },
    { name: 'Romania', code: 'RO', dial_code: '+40', flag: '🇷🇴' }, { name: 'Russia', code: 'RU', dial_code: '+7', flag: '🇷🇺' },
    { name: 'Rwanda', code: 'RW', dial_code: '+250', flag: '🇷🇼' }, { name: 'Saint Barthélemy', code: 'BL', dial_code: '+590', flag: '🇧🇱' },
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
    { name: 'South Georgia and the South Sandwich Islands', code: 'GS', dial_code: '+500', flag: '🇬🇸' }, { name: 'South Sudan', code: 'SS', dial_code: '+211', flag: '🇸🇸' },
    { name: 'Spain', code: 'ES', dial_code: '+34', flag: '🇪🇸' }, { name: 'Sri Lanka', code: 'LK', dial_code: '+94', flag: '🇱🇰' },
    { name: 'Sudan', code: 'SD', dial_code: '+249', flag: '🇸🇩' }, { name: 'Suriname', code: 'SR', dial_code: '+597', flag: '🇸🇷' },
    { name: 'Svalbard and Jan Mayen', code: 'SJ', dial_code: '+47', flag: '🇸🇯' }, { name: 'Swaziland', code: 'SZ', dial_code: '+268', flag: '🇸🇿' },
    { name: 'Sweden', code: 'SE', dial_code: '+46', flag: '🇸🇪' }, { name: 'Switzerland', code: 'CH', dial_code: '+41', flag: '🇨🇭' },
    { name: 'Syrian Arab Republic', code: 'SY', dial_code: '+963', flag: '🇸🇾' }, { name: 'Taiwan, Province of China', code: 'TW', dial_code: '+886', flag: '🇹🇼' },
    { name: 'Tajikistan', code: 'TJ', dial_code: '+992', flag: '🇹🇯' }, { name: 'Tanzania, United Republic of', code: 'TZ', dial_code: '+255', flag: '🇹🇿' },
    { name: 'Thailand', code: 'TH', dial_code: '+66', flag: '🇹🇭' }, { name: 'Timor-Leste', code: 'TL', dial_code: '+670', flag: '🇹🇱' },
    { name: 'Togo', code: 'TG', dial_code: '+228', flag: '🇹🇬' }, { name: 'Tokelau', code: 'TK', dial_code: '+690', flag: '🇹🇰' },
    { name: 'Tonga', code: 'TO', dial_code: '+676', flag: '🇹🇴' }, { name: 'Trinidad and Tobago', code: 'TT', dial_code: '+1868', flag: '🇹🇹' },
    { name: 'Tunisia', code: 'TN', dial_code: '+216', flag: '🇹🇳' }, { name: 'Turkey', code: 'TR', dial_code: '+90', flag: '🇹🇷' },
    { name: 'Turkmenistan', code: 'TM', dial_code: '+993', flag: '🇹🇲' }, { name: 'Turks and Caicos Islands', code: 'TC', dial_code: '+1649', flag: '🇹🇨' },
    { name: 'Tuvalu', code: 'TV', dial_code: '+688', flag: '🇹🇻' }, { name: 'Uganda', code: 'UG', dial_code: '+256', flag: '🇺🇬' },
    { name: 'Ukraine', code: 'UA', dial_code: '+380', flag: '🇺🇦' }, { name: 'United Arab Emirates', code: 'AE', dial_code: '+971', flag: '🇦🇪' },
    { name: 'United Kingdom', code: 'GB', dial_code: '+44', flag: '🇬🇧' }, { name: 'United States', code: 'US', dial_code: '+1', flag: '🇺🇸' },
    { name: 'Uruguay', code: 'UY', dial_code: '+598', flag: '🇺🇾' }, { name: 'Uzbekistan', code: 'UZ', dial_code: '+998', flag: '🇺🇿' },
    { name: 'Vanuatu', code: 'VU', dial_code: '+678', flag: '🇻🇺' }, { name: 'Venezuela', code: 'VE', dial_code: '+58', flag: '🇻🇪' },
    { name: 'Viet Nam', code: 'VN', dial_code: '+84', flag: '🇻🇳' }, { name: 'Virgin Islands, British', code: 'VG', dial_code: '+1284', flag: '🇻🇬' },
    { name: 'Virgin Islands, U.S.', code: 'VI', dial_code: '+1340', flag: '🇻🇮' }, { name: 'Wallis and Futuna', code: 'WF', dial_code: '+681', flag: '🇼🇫' },
    { name: 'Yemen', code: 'YE', dial_code: '+967', flag: '🇾🇪' }, { name: 'Zambia', code: 'ZM', dial_code: '+260', flag: '🇿🇲' },
    { name: 'Zimbabwe', code: 'ZW', dial_code: '+263', flag: '🇿🇼' }
].sort((a, b) => a.name.localeCompare(b.name));

interface OnboardingData {
  name: string;
  age: string;
  gender: 'Homme' | 'Femme' | 'Autre' | '';
  interestedIn: 'Hommes' | 'Femmes' | 'Tout le monde' | '';
  city: string;
  photos: string[]; // base64 strings
  bio: string;
  interests: string[];
  distancePreference: number;
  phone: string;
  country: Country | null;
}

const interestsList = [
    { name: 'Voyage', emoji: '✈️' }, { name: 'Photographie', emoji: '📷' },
    { name: 'Cuisine', emoji: '🍳' }, { name: 'Randonnée', emoji: '🥾' },
    { name: 'Art', emoji: '🎨' }, { name: 'Musique', emoji: '🎵' },
    { name: 'Cinéma', emoji: '🎬' }, { name: 'Lecture', emoji: '📚' },
    { name: 'Fitness', emoji: '💪' }, { name: 'Yoga', emoji: '🧘' },
    { name: 'Danse', emoji: '💃' }, { name: 'Jeux Vidéo', emoji: '🎮' },
];
const bioPrompts = [
    "Un fait amusant sur moi : ",
    "La meilleure façon de m'inviter à sortir est...",
    "Je suis vraiment doué(e) pour...",
    "Ce que je recherche chez un partenaire :",
    "Mon week-end parfait ressemble à...",
];
const citiesList = ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Bruxelles', 'Genève', 'Montréal'];

const TOTAL_STEPS = 8; // Increased to 8 to include StepReady

// --- HELPER & CHILD COMPONENTS ---

const ProgressBar: React.FC<{ step: number }> = ({ step }) => (
  <div className="w-full">
    <span className="text-sm font-semibold text-gray-500">Étape {step} sur {TOTAL_STEPS - 1}</span>
    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
      <motion.div
        className="bg-rose-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  </div>
);

const OnboardingContainer: React.FC<{ title: string; subtitle: string; children: React.ReactNode; }> = ({ title, subtitle, children }) => (
  <div className="w-full max-w-lg mx-auto">
    <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-4xl font-bold text-gray-800"
    >
        {title}
    </motion.h1>
    <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-2 text-lg text-gray-500"
    >
        {subtitle}
    </motion.p>
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10"
    >
        {children}
    </motion.div>
  </div>
);

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 },
};

const pageTransition = { type: 'spring', stiffness: 200, damping: 25 };


// --- ONBOARDING STEP COMPONENTS ---

const StepWelcome: React.FC = () => (
    <div className="text-center">
        <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-block p-6 bg-rose-100 rounded-full"
        >
            <HeartIcon className="w-20 h-20 text-rose-500" />
        </motion.div>
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            className="font-display text-4xl font-bold text-gray-800 mt-8"
        >
            Créez un profil qui vous ressemble.
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
            className="mt-4 text-xl text-gray-600 max-w-md mx-auto"
        >
            L'authenticité est le début de toute belle histoire. Façonnons la vôtre.
        </motion.p>
    </div>
);

const CountryPickerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (country: Country) => void;
}> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCountries = useMemo(() =>
        countries.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm]
    );

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl w-full max-w-md flex flex-col h-[70vh]"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="p-4 border-b sticky top-0 bg-white">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un pays..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                    </div>
                    <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {filteredCountries.map(country => (
                        <div key={country.code} onClick={() => onSelect(country)} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="flex-grow font-semibold text-gray-700">{country.name}</span>
                            <span className="text-gray-500">{country.dial_code}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

const StepIdentity: React.FC<{ data: OnboardingData; update: (d: Partial<OnboardingData>) => void; }> = ({ data, update }) => {
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  const handleCountrySelect = (country: Country) => {
      update({ country });
      setIsCountryPickerOpen(false);
  };
  
  return (
    <OnboardingContainer title="Commençons par les bases" subtitle="Ces informations apparaîtront sur votre profil.">
      <div className="space-y-6">
        <input 
            type="text" 
            placeholder="Prénom" 
            value={data.name} 
            onChange={e => update({ name: e.target.value })}
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition" 
        />
        <input 
            type="number" 
            placeholder="Âge" 
            value={data.age} 
            onChange={e => update({ age: e.target.value })}
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition" 
        />
        <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-rose-300 transition">
            <div 
                onClick={() => setIsCountryPickerOpen(true)}
                className="flex items-center gap-2 p-4 cursor-pointer hover:bg-gray-50 rounded-l-xl"
            >
                <span className="text-2xl">{data.country?.flag ?? '🌍'}</span>
                <span className="font-semibold">{data.country?.dial_code ?? '+?'}</span>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input 
                type="tel"
                placeholder="Numéro de téléphone"
                value={data.phone}
                onChange={e => update({ phone: e.target.value })}
                className="w-full p-4 bg-transparent text-lg focus:outline-none"
            />
        </div>
        <AnimatePresence>
            <CountryPickerModal 
                isOpen={isCountryPickerOpen}
                onClose={() => setIsCountryPickerOpen(false)}
                onSelect={handleCountrySelect}
            />
        </AnimatePresence>
      </div>
    </OnboardingContainer>
  );
};

const StepPreferences: React.FC<{ data: OnboardingData; update: (d: Partial<OnboardingData>) => void; }> = ({ data, update }) => {
    const genders: ('Homme' | 'Femme' | 'Autre')[] = ['Homme', 'Femme', 'Autre'];
    const interests: ('Hommes' | 'Femmes' | 'Tout le monde')[] = ['Hommes', 'Femmes', 'Tout le monde'];

    return (
        <OnboardingContainer title="Qui êtes-vous et qui recherchez-vous ?" subtitle="Aidez-nous à trouver les bonnes personnes pour vous.">
            <div className="space-y-8">
                <div>
                    <h3 className="font-semibold text-lg text-gray-700 mb-3">Je suis un(e) :</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {genders.map(g => (
                            <button key={g} onClick={() => update({ gender: g })} className={`p-4 border-2 rounded-xl text-lg font-semibold transition-all ${data.gender === g ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'}`}>
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-700 mb-3">Je suis intéressé(e) par :</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {interests.map(i => (
                            <button key={i} onClick={() => update({ interestedIn: i })} className={`p-4 border-2 rounded-xl text-lg font-semibold transition-all ${data.interestedIn === i ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'}`}>
                                {i}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg text-gray-700 mb-3">Distance de recherche : <span className="text-rose-500 font-bold">{data.distancePreference} km</span></h3>
                    <input
                        type="range"
                        min="1"
                        max="200"
                        value={data.distancePreference}
                        onChange={(e) => update({ distancePreference: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                </div>
            </div>
        </OnboardingContainer>
    );
};

const StepCity: React.FC<{ data: OnboardingData; update: (d: Partial<OnboardingData>) => void; }> = ({ data, update }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        update({ city: value });
        if (value.length > 1) {
            setSuggestions(citiesList.filter(city => city.toLowerCase().startsWith(value.toLowerCase())));
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = (city: string) => {
        update({ city });
        setSuggestions([]);
    };

    return (
         <OnboardingContainer title="Où habitez-vous ?" subtitle="Cette information nous aide à vous mettre en relation avec des personnes proches.">
             <div className="relative">
                <input 
                    type="text" 
                    placeholder="Entrez votre ville" 
                    value={data.city} 
                    onChange={handleCityChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition" 
                />
                {suggestions.length > 0 && (
                    <motion.ul 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
                    >
                        {suggestions.slice(0, 5).map(city => (
                            <li 
                                key={city} 
                                onClick={() => selectSuggestion(city)} 
                                className="p-3 cursor-pointer hover:bg-gray-100 first:rounded-t-xl last:rounded-b-xl"
                            >
                                {city}
                            </li>
                        ))}
                    </motion.ul>
                )}
             </div>
        </OnboardingContainer>
    );
};

const StepPhotos: React.FC<{ data: OnboardingData; update: (d: Partial<OnboardingData>) => void; }> = ({ data, update }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && data.photos.length < 6) {
            const files = Array.from(e.target.files).slice(0, 6 - data.photos.length);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    update({ photos: [...data.photos, reader.result as string] });
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (index: number) => {
        update({ photos: data.photos.filter((_, i) => i !== index) });
    };

    return (
        <OnboardingContainer title="Montrez qui vous êtes" subtitle="Ajoutez au moins deux photos. La première sera votre photo de profil principale.">
            <Reorder.Group axis="x" values={data.photos} onReorder={photos => update({ photos })} className="grid grid-cols-3 gap-4">
                {data.photos.map((photo, index) => (
                    <Reorder.Item key={photo} value={photo} className="relative aspect-square cursor-grab active:cursor-grabbing">
                        <img src={photo} alt={`photo ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                        <button onClick={() => removePhoto(index)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                        {index === 0 && <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white font-semibold px-2 py-0.5 rounded-full">Profil</div>}
                    </Reorder.Item>
                ))}
                {data.photos.length < 6 && (
                    <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-rose-300 transition-colors">
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" />
                        <div className="text-center">
                            <PlusIcon className="w-8 h-8 mx-auto" />
                        </div>
                    </label>
                )}
            </Reorder.Group>
        </OnboardingContainer>
    );
};

const StepBio: React.FC<{ data: OnboardingData; update: (d: Partial<OnboardingData>) => void; isLoading: boolean; setIsLoading: (l: boolean) => void; }> = ({ data, update, isLoading, setIsLoading }) => {
    const handleGenerateBio = async () => {
        setIsLoading(true);
        try {
            if (!process.env.API_KEY) {
                throw new Error("API_KEY environment variable not set");
            }
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Génère une bio de profil de rencontre courte et accrocheuse (environ 40-50 mots) en français pour une personne qui est ${data.gender}, ${data.age} ans, qui aime ${data.interests.join(', ')} et vit à ${data.city}. Le ton doit être authentique et inviter à la conversation. Ne pas inclure de hashtags.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            bio: { type: Type.STRING }
                        }
                    }
                }
            });
            const json = JSON.parse(response.text.trim());
            if (json.bio) {
                update({ bio: json.bio });
            }
        } catch (error) {
            console.error("Error generating bio:", error);
            // Fallback bio
            update({ bio: "Passionné(e) par la vie, j'aime explorer de nouveaux endroits et rencontrer des gens intéressants. Toujours partant(e) pour une aventure !" });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <OnboardingContainer title="Parlez-nous de vous" subtitle="Votre bio est une excellente occasion de montrer votre personnalité.">
            <div className="relative">
                 <textarea 
                    placeholder="Écrivez quelque chose d'intéressant..." 
                    value={data.bio} 
                    onChange={e => update({ bio: e.target.value })}
                    className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition" 
                />
                <span className="absolute bottom-3 right-3 text-sm text-gray-400">{data.bio.length} / 300</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {bioPrompts.map(prompt => (
                    <button key={prompt} onClick={() => update({ bio: data.bio + prompt })} className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition">
                       + {prompt}
                    </button>
                ))}
            </div>
            <div className="mt-6 border-t pt-6">
                <button onClick={handleGenerateBio} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-violet-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-violet-600 transition disabled:bg-violet-300">
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Génération en cours...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            Suggérer une bio avec l'IA
                        </>
                    )}
                </button>
                 <p className="text-xs text-gray-400 text-center mt-2">Vous pourrez modifier la bio générée.</p>
            </div>
        </OnboardingContainer>
    );
};

const StepInterests: React.FC<{ data: OnboardingData; update: (d: Partial<OnboardingData>) => void; }> = ({ data, update }) => {
    const toggleInterest = (interest: string) => {
        const interests = data.interests.includes(interest)
            ? data.interests.filter(i => i !== interest)
            : [...data.interests, interest];
        if (interests.length <= 5) {
            update({ interests });
        }
    };

    return (
         <OnboardingContainer title="Qu'est-ce qui vous passionne ?" subtitle="Choisissez jusqu'à 5 centres d'intérêt.">
            <div className="flex flex-wrap gap-3">
                {interestsList.map(item => {
                    const isSelected = data.interests.includes(item.name);
                    return (
                         <button 
                            key={item.name} 
                            onClick={() => toggleInterest(item.name)}
                            className={`flex items-center gap-2 p-3 border-2 rounded-xl text-lg font-semibold transition-all ${isSelected ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'}`}
                        >
                            <span>{item.emoji}</span>
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </div>
            <p className="text-sm text-gray-500 mt-4 font-semibold">{data.interests.length} / 5 sélectionnés</p>
        </OnboardingContainer>
    );
};

const StepReady: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    return (
        <div className="text-center">
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                className="inline-block p-6 bg-green-100 rounded-full"
            >
                <PartyPopperIcon className="w-20 h-20 text-green-500" />
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                className="font-display text-4xl font-bold text-gray-800 mt-8"
            >
                Votre profil est prêt !
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
                className="mt-4 text-xl text-gray-600 max-w-md mx-auto"
            >
                Il est temps de découvrir des personnes incroyables. L'aventure ne fait que commencer.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
                className="mt-10"
            >
                <button
                    onClick={onComplete}
                    className="bg-rose-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    Commencer à découvrir
                </button>
            </motion.div>
        </div>
    );
};


// --- MAIN ONBOARDING VIEW ---
interface OnboardingViewProps {
  onComplete: () => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<OnboardingData>({
        name: '',
        age: '',
        gender: '',
        interestedIn: '',
        city: '',
        photos: [],
        bio: '',
        interests: [],
        distancePreference: 50,
        phone: '',
        country: countries.find(c => c.code === 'FR') || null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const updateData = useCallback((d: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...d }));
    }, []);

    const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    const renderStep = () => {
        switch (step) {
            case 0: return <StepWelcome />;
            case 1: return <StepIdentity data={data} update={updateData} />;
            case 2: return <StepPreferences data={data} update={updateData} />;
            case 3: return <StepCity data={data} update={updateData} />;
            case 4: return <StepPhotos data={data} update={updateData} />;
            case 5: return <StepBio data={data} update={updateData} isLoading={isLoading} setIsLoading={setIsLoading} />;
            case 6: return <StepInterests data={data} update={updateData} />;
            case 7: return <StepReady onComplete={onComplete} />;
            default: return null;
        }
    };

    const isNextDisabled = () => {
        switch (step) {
            case 1: return !data.name || !data.age || !data.phone || !data.country;
            case 2: return !data.gender || !data.interestedIn;
            case 3: return !data.city;
            case 4: return data.photos.length < 2;
            case 5: return data.bio.length < 20;
            case 6: return data.interests.length < 3;
            default: return false;
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col p-4 sm:p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                    transition={pageTransition}
                    className="flex-grow flex flex-col justify-center"
                >
                    {step > 0 && step < (TOTAL_STEPS - 1) && <div className="mb-8"><ProgressBar step={step} /></div>}
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <div className="flex-shrink-0 mt-8">
                <div className="max-w-lg mx-auto flex gap-4">
                    {step > 0 && step < (TOTAL_STEPS - 1) && (
                        <button onClick={prevStep} className="font-bold text-gray-600 py-4 px-6 rounded-full hover:bg-gray-200 transition-colors">
                            Retour
                        </button>
                    )}
                    {step < (TOTAL_STEPS - 1) && (
                         <button
                            onClick={nextStep}
                            disabled={isNextDisabled()}
                            className="flex-grow bg-rose-500 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:shadow-none disabled:scale-100"
                        >
                            {step === 0 ? "Commencer" : "Continuer"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// FIX: Add default export for the OnboardingView component
export default OnboardingView;
