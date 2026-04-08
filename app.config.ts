export default {
  expo: {
    name: 'Le Voyage des Compétences',
    slug: 'voyage-competences',
    scheme: 'voyage',
    plugins: [
      'expo-router',
      'expo-secure-store',
      ['expo-font', { fonts: [
        './assets/fonts/Poppins-Regular.ttf',
        './assets/fonts/Poppins-SemiBold.ttf',
        './assets/fonts/Poppins-Bold.ttf',
        './assets/fonts/Poppins-ExtraBold.ttf',
      ]}]
    ],
    android: { package: 'ma.ofppt.voyage' },
    ios: { bundleIdentifier: 'ma.ofppt.voyage' },
  }
}
