import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../theme/colors';

const LANGUAGES = [
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
];

export default function TranslationScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [text, setText] = useState('Attention passengers: Boarding for flight 6E2412 to New Delhi will commence at Gate 14B in 15 minutes.');
  const [translatedText, setTranslatedText] = useState('यात्रियों ध्यान दें: नई दिल्ली के लिए उड़ान 6E2412 की बोर्डिंग 15 मिनट में गेट 14B पर शुरू होगी।');

  const handleTranslate = () => {
    if (selectedLang.code === 'te') {
      setTranslatedText('ప్రయాణీకుల దృష్టికి: న్యూ ఢిల్లీకి వెళ్లే ఫ్లైట్ 6E2412 బోర్డింగ్ 15 నిమిషాల్లో గేట్ 14B వద్ద ప్రారంభమవుతుంది.');
    } else if (selectedLang.code === 'hi') {
      setTranslatedText('यात्रियों ध्यान दें: नई दिल्ली के लिए उड़ान 6E2412 की बोर्डिंग 15 मिनट में गेट 14B पर शुरू होगी।');
    } else {
      setTranslatedText(`[${selectedLang.name}] Announcement translated for airport staff.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>MULTILINGUAL AIRPORT ASSISTANT</Text>
            <Text style={styles.headerTitle}>Announcement Translation</Text>
          </View>
        </View>

        {/* Language selector */}
        <Text style={styles.sectionTitle}>SELECT TARGET LANGUAGE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langList}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langChip,
                selectedLang.code === lang.code && styles.activeLangChip,
              ]}
              onPress={() => {
                setSelectedLang(lang);
                handleTranslate();
              }}
            >
              <Text style={[styles.langChipText, selectedLang.code === lang.code && styles.activeLangText]}>
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Text Input */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>ORIGINAL ANNOUNCEMENT (ENGLISH)</Text>
          <TextInput
            style={styles.textInput}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Type or paste airport announcement..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <TouchableOpacity style={styles.translateBtn} onPress={handleTranslate}>
          <Ionicons name="language" size={20} color="#FFFFFF" />
          <Text style={styles.translateBtnText}>Translate Announcement</Text>
        </TouchableOpacity>

        {/* Translation Output */}
        <View style={[styles.card, { borderColor: Colors.borderAccent }]}>
          <View style={styles.outputHeader}>
            <Text style={[styles.cardHeader, { color: Colors.accent }]}>TRANSLATED TO {selectedLang.name.toUpperCase()}</Text>
            <Ionicons name="volume-high" size={20} color={Colors.accent} />
          </View>
          <Text style={styles.translatedText}>{translatedText}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  langList: {
    gap: 8,
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeLangChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  activeLangText: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  cardHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  textInput: {
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  translateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
  },
  translateBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  translatedText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 24,
  },
});
