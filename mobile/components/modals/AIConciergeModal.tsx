import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAIStore } from '../../store';
import { Colors } from '../../theme/colors';
import { sendAuraMessage } from '../../services/api/services';

const QUICK_ACTIONS = [
  { icon: 'briefcase-outline', label: 'Track baggage' },
  { icon: 'compass-outline', label: 'Navigate to gate' },
  { icon: 'subway-outline', label: 'Find metro route' },
  { icon: 'fast-food-outline', label: 'Order food' },
  { icon: 'medical-outline', label: 'Medical assistance' },
  { icon: 'language-outline', label: 'Translate announcement' },
];

export default function AIConciergeModal() {
  const { isOpen, setOpen, messages, addMessage } = useAIStore();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addMessage(userMsg);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await sendAuraMessage(text);
      addMessage({
        id: `ai-${Date.now()}`,
        sender: 'assistant' as const,
        text: res.reply || 'I am ready to assist you with your airport journey.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (e) {
      addMessage({
        id: `ai-${Date.now()}`,
        sender: 'assistant' as const,
        text: 'AURA Concierge is operating in offline mode. All local parameters look clear!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false} onRequestClose={() => setOpen(false)}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={18} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.title}>AURA AI Concierge</Text>
                <Text style={styles.subtitle}>SKYOS Intelligent Airport Companion</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
              <Ionicons name="close" size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Quick Actions Suggestions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.quickTitle}>SUGGESTED ACTIONS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickList}>
              {QUICK_ACTIONS.map((action, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickChip}
                  onPress={() => handleSend(action.label)}
                >
                  <Ionicons name={action.icon as any} size={14} color={Colors.accent} />
                  <Text style={styles.quickChipText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages */}
          <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {msg.sender === 'assistant' && (
                  <View style={styles.avatar}>
                    <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.bubbleContent}>
                  <Text style={msg.sender === 'user' ? styles.userText : styles.assistantText}>
                    {msg.text}
                  </Text>
                  <Text style={styles.timestamp}>{msg.timestamp}</Text>
                </View>
              </View>
            ))}
            {loading && (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <Text style={styles.assistantText}>AURA is processing your request...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="Ask AURA about flight, gate, baggage..."
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.disabledSend]}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(20,200,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  quickTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  quickList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    gap: 14,
  },
  messageBubble: {
    flexDirection: 'row',
    maxWidth: '85%',
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
    gap: 10,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubbleContent: {
    flex: 1,
  },
  userText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  assistantText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    paddingHorizontal: 18,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSend: {
    opacity: 0.4,
  },
});
