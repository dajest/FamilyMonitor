export default {
  common: {
    menu: 'Meniu',
    profile: 'Profilis',
    logout: 'Atsijungti',
    close: 'Uždaryti',
    open: 'Atidaryti',
    home: 'Pagrindinis',
    mainApp: 'Family Care Agency'
  },
  theme: {
    dark: 'Tamsi tema',
    light: 'Šviesi tema',
    toggle: 'Perjungti temą'
  },
  language: {
    russian: 'Rusų',
    english: 'Anglų',
    lithuanian: 'Lietuvių',
    select: 'Pasirinkti kalbą'
  },
  sidebar: {
    menu: 'Meniu',
    closeMenu: 'Uždaryti meniu',
    openMenu: 'Atidaryti meniu',
    home: 'Pagrindinis',
    consultants: 'Konsultantai'
  },
  header: {
    openMenu: 'Atidaryti meniu',
    closeMenu: 'Uždaryti meniu'
  },
  home: {
    welcome: 'Sveiki atvykę į pagrindinę programą',
    description: 'Tai pagrindinis programos puslapis. Čia galite pridėti savo turinį.'
  },
  profile: {
    title: 'Profilis',
    email: 'El. paštas',
    emailHint: 'El. pašto adreso pakeisti negalima',
    name: 'Vyriausiojo pastoriaus vardas',
    namePlaceholder: 'Įveskite vyriausiojo pastoriaus vardą',
    nameRequired: 'Vyriausiojo pastoriaus vardas yra privalomas',
    nameMinLength: 'Vyriausiojo pastoriaus vardas turi būti ne mažiau kaip 2 simboliai',
    title: 'Bažnyčios pavadinimas',
    titlePlaceholder: 'Įveskite savo titulą (pvz., pn., pnė., dr.)',
    titleRequired: 'Bažnyčios pavadinimas yra privalomas',
    titleMinLength: 'Bažnyčios pavadinimas turi būti ne mažiau kaip 1 simbolis',
    address: 'Adresas',
    addressPlaceholder: 'Įveskite savo adresą',
    addressRequired: 'Adresas yra privalomas',
    addressMinLength: 'Adresas turi būti ne mažiau kaip 1 simbolis',
    phone: 'Telefono numeris',
    phonePlaceholder: 'Įveskite savo telefono numerį',
    phoneRequired: 'Telefono numeris yra privalomas',
    phoneMinLength: 'Telefono numeris turi būti ne mažiau kaip 5 simboliai',
    emailRequired: 'El. paštas yra privalomas',
    emailMinLength: 'El. paštas turi būti ne mažiau kaip 1 simbolis',
    save: 'Išsaugoti pakeitimus',
    cancel: 'Atšaukti',
    saving: 'Išsaugoma...',
    blockTitle: 'Negalima palikti puslapio',
    blockMessage: 'Prašome užpildyti visus privalomus laukus prieš paliekant šį puslapį.',
    understand: 'Supratau'
  },
  auth: {
    register: {
      title: 'Registracija',
      churchName: 'Bažnyčios pavadinimas',
      churchNamePlaceholder: 'Įveskite savo bažnyčios pavadinimą',
      email: 'El. paštas',
      emailPlaceholder: 'Įveskite savo el. paštą',
      password: 'Slaptažodis',
      passwordPlaceholder: 'Įveskite savo slaptažodį',
      confirmPassword: 'Patvirtinkite slaptažodį',
      confirmPasswordPlaceholder: 'Patvirtinkite savo slaptažodį',
      registerButton: 'Registruotis',
      registering: 'Registruojama...',
      or: 'ARBA',
      continueWithGoogle: 'Tęsti su Google',
      alreadyHaveAccount: 'Jau turite paskyrą? Prisijungti',
      emailRequired: 'El. paštas yra privalomas',
      emailInvalid: 'Prašome įvesti galiojantį el. pašto adresą',
      passwordRequired: 'Slaptažodis yra privalomas',
      passwordMinLength: 'Slaptažodis turi būti ne mažiau kaip 6 simboliai',
      passwordsDoNotMatch: 'Slaptažodžiai nesutampa',
      registrationFailed: 'Registracija nepavyko. Prašome bandyti dar kartą.',
      userCreatedButFailed: 'Vartotojas sukurtas, bet nepavyko išsaugoti bažnyčios informacijos. Prašome susisiekti su pagalba.',
      registrationSuccessful: 'Registracija sėkminga! Prašome patikrinti savo el. paštą, kad patvirtintumėte paskyrą. Nukreipiama į prisijungimo puslapį...',
      errorOccurred: 'Įvyko klaida. Prašome bandyti dar kartą.',
      failedToSignInWithGoogle: 'Nepavyko prisijungti su Google.'
    },
    login: {
      title: 'Prisijungti',
      email: 'El. paštas',
      emailPlaceholder: 'Įveskite savo el. paštą',
      password: 'Slaptažodis',
      passwordPlaceholder: 'Įveskite savo slaptažodį',
      loginButton: 'Prisijungti',
      loggingIn: 'Prisijungiama...',
      or: 'ARBA',
      continueWithGoogle: 'Tęsti su Google',
      dontHaveAccount: 'Neturite paskyros? Registruotis',
      forgotPassword: 'Pamiršote slaptažodį?',
      emailRequired: 'El. paštas yra privalomas',
      emailInvalid: 'Prašome įvesti galiojantį el. pašto adresą',
      passwordRequired: 'Slaptažodis yra privalomas',
      passwordMinLength: 'Slaptažodis turi būti ne mažiau kaip 6 simboliai',
      loginFailed: 'Prisijungti nepavyko. Prašome patikrinti savo duomenis.',
      errorOccurred: 'Įvyko klaida. Prašome bandyti dar kartą.',
      failedToSignInWithGoogle: 'Nepavyko prisijungti su Google.',
      successfullyLoggedIn: '✓ Sėkmingai prisijungta!',
      logout: 'Atsijungti'
    },
    forgotPassword: {
      title: 'Pamiršote slaptažodį',
      description: 'Įveskite savo el. pašto adresą, ir mes išsiųsime jums nuorodą slaptažodžio atkūrimui.',
      email: 'El. paštas',
      emailPlaceholder: 'Įveskite savo el. paštą',
      sendResetLink: 'Siųsti atkūrimo nuorodą',
      sending: 'Siunčiama...',
      backToLogin: 'Grįžti į prisijungimą',
      emailRequired: 'El. paštas yra privalomas',
      emailInvalid: 'Prašome įvesti galiojantį el. pašto adresą',
      failedToSendResetLink: 'Nepavyko išsiųsti atkūrimo nuorodos. Prašome bandyti dar kartą.',
      resetLinkSent: 'Slaptažodžio atkūrimo nuoroda buvo išsiųsta į jūsų el. paštą!',
      errorOccurred: 'Įvyko klaida. Prašome bandyti dar kartą.'
    },
    changePassword: {
      title: 'Pakeisti slaptažodį',
      newPassword: 'Naujas slaptažodis',
      newPasswordPlaceholder: 'Įveskite savo naują slaptažodį',
      confirmPassword: 'Patvirtinkite naują slaptažodį',
      confirmPasswordPlaceholder: 'Patvirtinkite savo naują slaptažodį',
      changePasswordButton: 'Pakeisti slaptažodį',
      changingPassword: 'Keičiama slaptažodis...',
      backToLogin: 'Grįžti į prisijungimą',
      passwordRequired: 'Slaptažodis yra privalomas',
      passwordMinLength: 'Slaptažodis turi būti ne mažiau kaip 6 simboliai',
      pleaseConfirmPassword: 'Prašome patvirtinti savo slaptažodį',
      passwordsDoNotMatch: 'Slaptažodžiai nesutampa',
      failedToChangePassword: 'Nepavyko pakeisti slaptažodžio. Prašome bandyti dar kartą.',
      passwordChangedSuccessfully: 'Slaptažodis sėkmingai pakeistas!',
      errorOccurred: 'Įvyko klaida. Prašome bandyti dar kartą.'
    },
    resetPassword: {
      title: 'Atkurti slaptažodį',
      newPassword: 'Naujas slaptažodis',
      newPasswordPlaceholder: 'Įveskite savo naują slaptažodį',
      confirmPassword: 'Patvirtinkite naują slaptažodį',
      confirmPasswordPlaceholder: 'Patvirtinkite savo naują slaptažodį',
      resetPasswordButton: 'Atkurti slaptažodį',
      resettingPassword: 'Atkuriamas slaptažodis...',
      backToLogin: 'Grįžti į prisijungimą',
      passwordRequired: 'Slaptažodis yra privalomas',
      passwordMinLength: 'Slaptažodis turi būti ne mažiau kaip 6 simboliai',
      pleaseConfirmPassword: 'Prašome patvirtinti savo slaptažodį',
      passwordsDoNotMatch: 'Slaptažodžiai nesutampa',
      invalidOrExpiredLink: 'Negaliojanti arba pasibaigusi atkūrimo nuoroda. Prašome užsakyti naują.',
      failedToResetPassword: 'Nepavyko atkurti slaptažodžio. Prašome bandyti dar kartą arba užsakyti naują nuorodą.',
      passwordResetSuccessfully: 'Slaptažodis sėkmingai atkurtas! Nukreipiama į prisijungimo puslapį...',
      errorOccurred: 'Įvyko klaida. Prašome bandyti dar kartą.'
    }
  },
  googleAddress: {
    addressRequired: 'Adresas yra privalomas'
  },
  consultants: {
    title: 'Konsultantai',
    createButton: 'Sukurti konsultantą',
    emptyState: 'Konsultantų nerasta',
    status: {
      active: 'Aktyvus',
      inactive: 'Neaktyvus'
    },
    table: {
      name: 'Vardas',
      position: 'Pareigos',
      status: 'Būsena',
      actions: 'Veiksmai',
      edit: 'Redaguoti'
    },
    modal: {
      createTitle: 'Sukurti konsultantą',
      editTitle: 'Redaguoti konsultantą',
      cancel: 'Atšaukti',
      save: 'Išsaugoti'
    },
    form: {
      name: 'Vardas',
      namePlaceholder: 'Įveskite konsultanto vardą',
      position: 'Pareigos',
      positionPlaceholder: 'Įveskite pareigas',
      status: 'Būsena'
    },
    create: {
      title: 'Sukurti konsultantą',
      back: 'Atgal',
      cancel: 'Atšaukti',
      save: 'Išsaugoti',
      saving: 'Išsaugoma...'
    },
    edit: {
      title: 'Redaguoti konsultantą',
      back: 'Atgal',
      cancel: 'Atšaukti',
      save: 'Išsaugoti',
      saving: 'Išsaugoma...',
      loading: 'Įkeliami konsultanto duomenys...'
    },
    view: {
      title: 'Konsultanto duomenys',
      back: 'Atgal',
      backToConsultantsList: 'Grįžti į konsultantų sąrašą',
      edit: 'Redaguoti',
      loading: 'Įkeliami konsultanto duomenys...'
    },
    loading: 'Įkeliami konsultantai...'
  }
}
