import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { ZelligeBottomNav } from '../../components/ZelligeBottomNav';
import { SoundService } from '../../services/sounds';

const { width } = Dimensions.get('window');

const SCENARIO_DATA = {
  narrator: "Capitaine Amine",
  dialogue: "Félicitations aventurier ! Tu as surmonté les épreuves de l'espace. Nous approchons maintenant de notre destination finale. Quelle est ta première action à l'atterrissage ?",
  dialogueAr: "تهانينا أيها المغامر! لقد تغلبت على اختبارات الفضاء. نحن الآن نقترب من وجهتنا النهائية. ما هو إجراءك الأول عند الهبوط؟",
  choices: [
    { id: '1', text: "Sécuriser le périmètre du vaisseau", textAr: "تأمين محيط السفينة" },
    { id: '2', text: "Déployer les panneaux solaires", textAr: "نشر الألواح الشمسية" },
    { id: '3', text: "Établir un signal de communication", textAr: "إرسال إشارة اتصال" }
  ]
};

export default function ScenarioDialogueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedChoice(id);
    SoundService.getInstance().playSound('click');
    SoundService.getInstance().triggerHaptic('medium');
    
    // Continue based on scenario choice
    setTimeout(() => {
      router.push('/(challenges)/multiple-choice');
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ height: insets.top }} />
      
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.avatarContainer}>
          <View style={[styles.avatarCircle, { borderColor: colors.gold }]}>
             <MaterialIcons name="account-circle" size={100} color={colors.primary} />
          </View>
          <View style={[styles.nameTag, { backgroundColor: colors.gold }]}>
            <Text style={styles.nameText}>{SCENARIO_DATA.narrator}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.bubbleText, { color: colors.primary }]}>{SCENARIO_DATA.dialogue}</Text>
          <Text style={[styles.bubbleTextAr, { color: colors.primary + '80' }]}>{SCENARIO_DATA.dialogueAr}</Text>
          <View style={[styles.bubbleTail, { borderTopColor: colors.surface }]} />
        </Animated.View>

        <View style={styles.choicesContainer}>
          {SCENARIO_DATA.choices.map((choice, idx) => (
            <Animated.View key={choice.id} entering={FadeInUp.delay(600 + idx * 100)}>
              <TouchableOpacity
                onPress={() => handleSelect(choice.id)}
                style={[
                  styles.choiceCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedChoice === choice.id && { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primary + '05' }
                ]}
              >
                <View style={styles.choiceInfo}>
                  <Text style={[styles.choiceText, { color: colors.primary }]}>{choice.text}</Text>
                  <Text style={[styles.choiceTextAr, { color: colors.onSurfaceVariant }]}>{choice.textAr}</Text>
                </View>
                <MaterialIcons 
                  name={selectedChoice === choice.id ? "radio-button-checked" : "radio-button-unchecked"} 
                  size={24} 
                  color={selectedChoice === choice.id ? colors.primary : colors.border} 
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <ZelligeBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  avatarCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  nameTag: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 15, marginTop: -20, elevation: 4 },
  nameText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  bubble: { padding: 24, borderRadius: 32, borderWidth: 1, marginBottom: 40, position: 'relative', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  bubbleText: { fontSize: 16, fontWeight: '700', lineHeight: 24, textAlign: 'center', marginBottom: 12 },
  bubbleTextAr: { fontSize: 18, textAlign: 'center', lineHeight: 28 },
  bubbleTail: { position: 'absolute', bottom: -15, alignSelf: 'center', width: 0, height: 0, borderLeftWidth: 15, borderLeftColor: 'transparent', borderRightWidth: 15, borderRightColor: 'transparent', borderTopWidth: 15 },
  choicesContainer: { gap: 12 },
  choiceCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 1.5, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5 },
  choiceInfo: { flex: 1 },
  choiceText: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  choiceTextAr: { fontSize: 13, fontWeight: '600' }
});
