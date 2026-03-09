import React, { useState, useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Switch, StatusBar, Modal, TextInput, ScrollView, Alert, Vibration, Share, Platform, Animated, Easing, Image, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

import { initializeApp, getApp, getApps } from 'firebase/app'; 
import { getAuth, onAuthStateChanged, signInAnonymously, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBQAuZk2Di0Q_GuqAtmmKUOQwjIz_wQ29Y",
  authDomain: "pocket-wise-75f94.firebaseapp.com",
  projectId: "pocket-wise-75f94",
  storageBucket: "pocket-wise-75f94.firebasestorage.app",
  messagingSenderId: "319768164816",
  appId: "1:319768164816:web:1ff0a5252285371ce261d5"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const ThemeContext = createContext();

function AuthScreen({ navigation }) {
  const { colors, isDark } = useContext(ThemeContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setIsLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={[styles.authContainer, { backgroundColor: isDark ? '#000' : '#F4F7F6' }]}>
      <View style={styles.authHeader}>
        <Image 
          source={require('../assets/images/pocket wise logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>POCKET<Text style={{color: '#2ecc71'}}>WISE</Text></Text>
        <Text style={{color: colors.text, opacity: 0.5}}>Secure Fintech Ecosystem</Text>
      </View>

      <View style={[styles.authCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <Text style={[styles.authTitle, { color: colors.text }]}>
          {showForgotPassword ? 'Reset Password' : (isLogin ? 'Sign In' : 'Create Account')}
        </Text>

        {!showForgotPassword && (
          <>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={[styles.authInput, { color: colors.text, backgroundColor: isDark ? '#333' : '#f5f5f5' }]}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={[styles.authInput, { color: colors.text, backgroundColor: isDark ? '#333' : '#f5f5f5' }]}
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Confirm Password</Text>
                <TextInput
                  placeholder="Confirm your password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={[styles.authInput, { color: colors.text, backgroundColor: isDark ? '#333' : '#f5f5f5' }]}
                />
              </View>
            )}

            {isLogin && (
              <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.authBtn, { opacity: isLoading ? 0.7 : 1 }]} 
              onPress={isLogin ? handleLogin : handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.authBtnText}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchMode}>
              <Text style={{ color: '#888' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchModeText}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showForgotPassword && (
          <>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={[styles.authInput, { color: colors.text, backgroundColor: isDark ? '#333' : '#f5f5f5' }]}
              />
            </View>

            <TouchableOpacity 
              style={[styles.authBtn, { opacity: isLoading ? 0.7 : 1 }]} 
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.authBtnText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchMode} onPress={() => setShowForgotPassword(false)}>
              <Text style={styles.switchModeText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity 
        style={styles.guestBtn} 
        onPress={() => signInAnonymously(auth).catch(err => Alert.alert("Error", err.message))}
      >
        <Text style={styles.guestBtnText}>Continue as Guest</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StockMarket({ isDark }) {
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.52, change: 2.35, changePercent: 1.33 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.85, changePercent: -0.60 },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 4.12, changePercent: 1.10 },
    { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 1.56, changePercent: 0.88 },
    { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: -5.20, changePercent: -2.05 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 495.22, change: 12.45, changePercent: 2.58 },
  ]);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const randomChange = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(1, stock.price + randomChange);
        const newChange = stock.change + randomChange;
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(((newChange / stock.price) * 100).toFixed(2))
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.stockSection, { backgroundColor: isDark ? '#1a1a1a' : '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 20 }]}>
      <View style={styles.rowBetween}>
        <Text style={[styles.sectionTitle, { fontSize: 16, color: isDark ? '#fff' : '#1A1A1A' }]}>📈 Stock Market</Text>
        <View style={styles.row}>
          <View style={[styles.liveDot, { backgroundColor: '#2ecc71' }]} />
          <Text style={{ color: '#2ecc71', fontSize: 12 }}>LIVE</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
        {stocks.map(stock => (
          <TouchableOpacity 
            key={stock.symbol} 
            style={[styles.stockCard, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}
            onPress={() => setSelectedStock(stock)}
          >
            <Text style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#1A1A1A' }}>{stock.symbol}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#fff' : '#1A1A1A', marginTop: 5 }}>${stock.price}</Text>
            <Text style={{ color: stock.change >= 0 ? '#2ecc71' : '#e74c3c', fontSize: 12, marginTop: 5 }}>
              {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedStock} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setSelectedStock(null)}><Text style={{ color: 'red' }}>Close</Text></TouchableOpacity>
              <Text style={{ color: isDark ? '#fff' : '#1A1A1A', fontWeight: 'bold' }}>{selectedStock?.symbol}</Text>
              <View style={{ width: 40 }} />
            </View>
            {selectedStock && (
              <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text style={{ fontSize: 48, fontWeight: 'bold', color: isDark ? '#fff' : '#1A1A1A' }}>${selectedStock.price}</Text>
                <Text style={{ color: selectedStock.change >= 0 ? '#2ecc71' : '#e74c3c', fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.changePercent}%)
                </Text>
                <Text style={{ color: '#888', marginTop: 20, textAlign: 'center' }}>{selectedStock.name}</Text>
                <Text style={{ color: '#888', marginTop: 5 }}>Market Status: Open</Text>
                <TouchableOpacity style={[styles.confirmBtn, { marginTop: 30, width: '100%' }]}>
                  <Text style={styles.btnText}>Buy {selectedStock.symbol}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Dashboard() {
  const { colors, isDark } = useContext(ThemeContext);
  const [balance, setBalance] = useState(14250.60);
  const [showBalance, setShowBalance] = useState(true);
  
  const [swapModal, setSwapModal] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [processingModal, setProcessingModal] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [amtModal, setAmtModal] = useState(false);
  const [fraudModal, setFraudModal] = useState(false);
  const [savingsModal, setSavingsModal] = useState(false);
  const [insightsModal, setInsightsModal] = useState(false);
  const [billSplitModal, setBillSplitModal] = useState(false);
  const [slipModal, setSlipModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [pendingTx, setPendingTx] = useState(null);
  
  const [showUndoBar, setShowUndoBar] = useState(false);
  const [lastCompletedTx, setLastCompletedTx] = useState(null);
  
  const [showAddFavorite, setShowAddFavorite] = useState(false);
  const [repeatMonthly, setRepeatMonthly] = useState(false);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  const [activeAction, setActiveAction] = useState('');
  const [inputAmt, setInputAmt] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [targetCurr, setTargetCurr] = useState({ label: 'NGN', rate: 1650, symbol: '₦' });
  const [lastTx, setLastTx] = useState({ usd: 0, received: 0 });

  const [savingsGoals, setSavingsGoals] = useState([
    { id: '1', name: 'Emergency Fund', target: 5000, saved: 3250, icon: '🛡️' },
    { id: '2', name: 'Vacation', target: 2000, saved: 850, icon: '✈️' },
  ]);
  const [roundUpEnabled, setRoundUpEnabled] = useState(true);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const [splitBillAmt, setSplitBillAmt] = useState('');
  const [splitMembers, setSplitMembers] = useState([{ name: 'You', amount: 0 }]);
  const [splitDesc, setSplitDesc] = useState('');

  const [userPoints, setUserPoints] = useState(2450);
  const [badges, setBadges] = useState([
    { id: '1', name: 'First Transaction', icon: '🎉', earned: true },
    { id: '2', name: 'Save $1000', icon: '💰', earned: true },
    { id: '3', name: '10 Transactions', icon: '📊', earned: false },
    { id: '4', name: 'Refer Friend', icon: '👥', earned: false },
  ]);

  const rates = [
    { label: 'NGN', rate: 1650, symbol: '₦' },
    { label: 'GBP', rate: 0.79, symbol: '£' },
    { label: 'EUR', rate: 0.92, symbol: '€' }
  ];

  const [transactions, setTransactions] = useState([
    { id: '1', title: 'Apple Store', cat: 'Tech', amt: -999.00, time: '2h ago', icon: '💻', date: '2024-01-15', ref: 'TXN-001-AAPL' },
    { id: '2', title: 'Salary Deposit', cat: 'Income', amt: 4500.00, time: '6h ago', icon: '🏦', date: '2024-01-14', ref: 'TXN-002-SAL' },
  ]);

  const insights = useMemo(() => {
    const spending = transactions.filter(t => t.amt < 0).reduce((sum, t) => sum + Math.abs(t.amt), 0);
    const income = transactions.filter(t => t.amt > 0).reduce((sum, t) => sum + t.amt, 0);
    const savings = income - spending;
    return {
      spending,
      income,
      savings,
      tip: savings > 2000 ? "Great job! You're saving well. Consider investing in a high-yield account." : "Try to save at least 20% of your income.",
      category: spending > 1000 ? "High Spender" : "Moderate Spender"
    };
  }, [transactions]);

  const checkForFraud = (amount, type) => {
    if (amount > 5000 || (type === 'Send' && amount > 3000)) {
      setPendingTx({ amount, type });
      setFraudModal(true);
      Vibration.vibrate([0, 500, 200, 500]);
      return false;
    }
    return true;
  };

  const startProcessingAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };

  const stopProcessingAnimation = () => {
    spinValue.stopAnimation();
    spinValue.setValue(0);
  };

  const playSuccessAnimation = () => {
    checkmarkScale.setValue(0);
    Animated.spring(checkmarkScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  const sendPushNotification = (amount, type, recipient) => {
    Vibration.vibrate([0, 200, 100, 200, 100, 200]);
    const message = type === 'Send' 
      ? `Debit Alert: Sent $${amount.toFixed(2)} to ${recipient || 'Unknown'}`
      : `Transaction Alert: ${type} $${amount.toFixed(2)}`;
    Alert.alert("Payment Alert", message, [{ text: 'OK', style: 'default' }]);
  };

  const handleUndoTransaction = () => {
    if (!lastCompletedTx) return;
    setBalance(prev => prev - lastCompletedTx.amt);
    setTransactions(prev => prev.filter(t => t.id !== lastCompletedTx.id));
    if (lastCompletedTx.roundUpAmt) {
      setSavingsGoals(prev => prev.map(g => g.id === '1' ? { ...g, saved: g.saved - lastCompletedTx.roundUpAmt } : g));
    }
    setShowUndoBar(false);
    setLastCompletedTx(null);
    Alert.alert("Transaction Undone", "Your transaction has been reversed.");
  };

  const startUndoTimer = (tx) => {
    setLastCompletedTx(tx);
    setShowUndoBar(true);
    setTimeout(() => { setShowUndoBar(false); }, 5000);
  };

  const handleFraudDecision = (approve) => {
    setFraudModal(false);
    if (approve) {
      Alert.alert("✅ Transaction Approved", "Your transaction is being processed.");
      goToPin();
    } else {
      Alert.alert("❌ Transaction Blocked", "Your transaction has been blocked for your security.");
      setPendingTx(null);
    }
  };

  const applyRoundUp = (amount) => {
    if (!roundUpEnabled) return 0;
    const rounded = Math.ceil(amount);
    return rounded - amount;
  };

  const generateSlip = (transaction) => {
    setSelectedTx(transaction);
    setSlipModal(true);
  };

  const shareTransactionSlip = async () => {
    if (!selectedTx) return;
    const slipContent = `
🧾 POCKET WISE TRANSACTION SLIP
================================
Reference: ${selectedTx.ref || 'TXN-' + selectedTx.id}
Date: ${selectedTx.date || new Date().toISOString().split('T')[0]}
Time: ${selectedTx.time || 'Just now'}
--------------------------------
Type: ${selectedTx.cat}
Description: ${selectedTx.title}
Amount: ${selectedTx.amt > 0 ? '+' : ''}$${Math.abs(selectedTx.amt).toFixed(2)}
Status: ✅ COMPLETED
--------------------------------
Thank you for using Pocket Wise!
    `;
    try {
      await Share.share({ message: slipContent, title: 'Transaction Slip - ' + selectedTx.ref });
    } catch (error) {
      Alert.alert("Error", "Could not share the slip");
    }
  };

  const startAction = (type) => {
    setActiveAction(type);
    if (type === 'Swap') setSwapModal(true);
    else if (type === 'Split') setBillSplitModal(true);
    else setAmtModal(true);
  };

  const goToPin = () => {
    const val = parseFloat(inputAmt);
    if (isNaN(val) || val <= 0 || (activeAction !== 'Add' && val > balance)) {
      Alert.alert("Invalid Request", "Please check your amount or balance.");
      return;
    }
    setSwapModal(false);
    setAmtModal(false);
    setPinModal(true);
  };

  const goBackFromPin = () => {
    setPinModal(false);
    if (activeAction === 'Swap') setSwapModal(true);
    else setAmtModal(true);
  };

  const finalizeTx = () => {
    if (inputPin !== '1234') { Alert.alert("Security Alert", "Invalid PIN."); return; }
    const val = parseFloat(inputAmt);
    const isAdd = activeAction === 'Add';
    const isSwap = activeAction === 'Swap';
    const finalAmt = isAdd ? val : -val;
    const txRef = 'TXN-' + Date.now().toString().slice(-6);

    setPinModal(false);
    setProcessingModal(true);
    startProcessingAnimation();

    setTimeout(() => {
      stopProcessingAnimation();
      const roundUpAmount = applyRoundUp(val);
      if (roundUpAmount > 0 && savingsGoals.length > 0) {
        setSavingsGoals(prev => prev.map(g => g.id === '1' ? { ...g, saved: g.saved + roundUpAmount } : g));
        setTransactions(prev => [{
          id: Date.now().toString(),
          title: `Round-up to ${savingsGoals[0].name}`,
          cat: 'Savings',
          amt: -roundUpAmount,
          time: 'Just now',
          icon: '🎯',
          date: new Date().toISOString().split('T')[0],
          ref: 'TXN-' + Date.now().toString().slice(-6)
        }, ...prev]);
      }

      setBalance(prev => prev + finalAmt);
      setLastTx({ usd: val, received: val * (isSwap ? targetCurr.rate : 1) });
      setUserPoints(prev => prev + (isAdd ? 10 : 25));

      const newTx = {
        id: Date.now().toString(),
        title: isSwap ? `Swapped to ${targetCurr.label}` : `${activeAction} Funds`,
        cat: isSwap ? 'Exchange' : (isAdd ? 'Deposit' : 'Expense'),
        amt: finalAmt,
        time: 'Just now',
        icon: isSwap ? '🔄' : (isAdd ? '➕' : '💸'),
        date: new Date().toISOString().split('T')[0],
        ref: txRef,
        roundUpAmt: roundUpAmount
      };

      setTransactions(prev => [newTx, ...prev]);
      setProcessingModal(false);
      setReceiptModal(true);
      setInputPin('');
      playSuccessAnimation();
      sendPushNotification(val, activeAction, isSwap ? targetCurr.label : null);
      startUndoTimer(newTx);
      if (activeAction === 'Send') setShowAddFavorite(true);
    }, 1000);
  };

  const addSavingsGoal = () => {
    if (!newGoalName || !newGoalTarget) {
      Alert.alert("Error", "Please enter goal name and target amount.");
      return;
    }
    setSavingsGoals(prev => [...prev, {
      id: Date.now().toString(),
      name: newGoalName,
      target: parseFloat(newGoalTarget),
      saved: 0,
      icon: '🎯'
    }]);
    setNewGoalName('');
    setNewGoalTarget('');
    setSavingsModal(false);
    Alert.alert("✅ Goal Created!", `You're now saving for ${newGoalName}`);
  };

  const processBillSplit = () => {
    const total = parseFloat(splitBillAmt);
    if (isNaN(total) || total <= 0) {
      Alert.alert("Error", "Please enter a valid bill amount.");
      return;
    }
    const perPerson = total / splitMembers.length;
    setSplitMembers(prev => prev.map(m => ({ ...m, amount: perPerson })));
    Alert.alert("✅ Bill Split!", `Each person pays: $${perPerson.toFixed(2)}`);
  };

  const renderHeader = () => (
    <View>
      <StockMarket isDark={isDark} />
      <View style={[styles.pointsBar, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <View style={styles.row}>
          <Text style={{ fontSize: 20 }}>⭐</Text>
          <Text style={{ color: colors.text, fontWeight: 'bold', marginLeft: 8 }}>{userPoints.toLocaleString()} pts</Text>
        </View>
        <TouchableOpacity onPress={() => setInsightsModal(true)}>
          <Text style={{ color: '#2ecc71', fontWeight: '600' }}>View Insights →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.premiumCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardLabel}>USD Portfolio</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
            <Text style={{fontSize: 22}}>{showBalance ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.mainBalance}>{showBalance ? `$${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '••••••••'}</Text>
        <View style={styles.cardFooter}><Text style={styles.cardNumber}>**** 8821</Text><Text style={styles.cardExpiry}>09/27</Text></View>
      </View>

      <View style={[styles.savingsSection, { backgroundColor: isDark ? '#111' : '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 20 }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { fontSize: 16, color: colors.text }]}>Savings Goals</Text>
          <TouchableOpacity onPress={() => setSavingsModal(true)}><Text style={{ color: '#2ecc71' }}>+ Add</Text></TouchableOpacity>
        </View>
        {savingsGoals.map(goal => (
          <View key={goal.id} style={{ marginTop: 12 }}>
            <View style={styles.rowBetween}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>{goal.icon} {goal.name}</Text>
              <Text style={{ color: '#2ecc71', fontWeight: 'bold' }}>${goal.saved} / ${goal.target}</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
              <View style={[styles.progressFill, { width: `${Math.min((goal.saved / goal.target) * 100, 100)}%` }]} />
            </View>
          </View>
        ))}
        <View style={[styles.roundUpToggle, { marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={{ color: colors.text, fontSize: 13 }}>🎯 Round-up Savings</Text>
          <Switch value={roundUpEnabled} onValueChange={setRoundUpEnabled} trackColor={{ true: '#2ecc71' }} />
        </View>
      </View>

      <View style={styles.actionGrid}>
        {[{l:'Send', i:'📤'}, {l:'Add', i:'➕'}, {l:'Swap', i:'🔄'}, {l:'Split', i:'🔪'}, {l:'Goals', i:'🎯'}, {l:'Insights', i:'📊'}].map((item) => (
          <TouchableOpacity key={item.l} style={styles.actionItem} onPress={() => {
            if (item.l === 'Goals') setSavingsModal(true);
            else if (item.l === 'Insights') setInsightsModal(true);
            else startAction(item.l);
          }}>
            <View style={[styles.actionIcon, {backgroundColor: isDark ? '#222' : '#fff'}]}><Text style={{fontSize: 20}}>{item.i}</Text></View>
            <Text style={[styles.actionText, {color: colors.text}]}>{item.l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.sectionTitle, {color: colors.text, paddingHorizontal: 20}]}>Recent Activity</Text>
    </View>
  );

  const gradientColors = isDark ? ['#0f0c29', '#302b63', '#24243e'] : ['#f5f7fa', '#c3cfe2', '#e8eff5'];
  
  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <FlatList ListHeaderComponent={renderHeader} data={transactions} keyExtractor={item => item.id} renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.transCard, {backgroundColor: isDark ? '#111' : '#fff', marginHorizontal: 20}]}
            onPress={() => generateSlip(item)}
          >
            <View style={styles.row}><View style={styles.iconBox}><Text>{item.icon}</Text></View>
            <View><Text style={[styles.transTitle, {color: colors.text}]}>{item.title}</Text><Text style={styles.transSub}>{item.time} • {item.cat}</Text></View></View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.transAmt, {color: item.amt > 0 ? '#2ecc71' : colors.text}]}>{item.amt > 0 ? `+$${item.amt}` : `-$${Math.abs(item.amt)}`}</Text>
              <Text style={{ color: '#888', fontSize: 10, marginTop: 3 }}>Tap for slip</Text>
            </View>
          </TouchableOpacity>
        )} />

        <Modal visible={slipModal} animationType="slide" transparent={true}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', padding: 25 }]}>
            <View style={[styles.receiptCard, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
              <Text style={{ fontSize: 40, textAlign: 'center' }}>🧾</Text>
              <Text style={[styles.title, { textAlign: 'center', color: '#2ecc71' }]}>Transaction Slip</Text>
              {selectedTx && (
                <>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Reference:</Text><Text style={{ color: colors.text, fontWeight: 'bold' }}>{selectedTx.ref}</Text></View>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Date:</Text><Text style={{ color: colors.text }}>{selectedTx.date}</Text></View>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Time:</Text><Text style={{ color: colors.text }}>{selectedTx.time}</Text></View>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Type:</Text><Text style={{ color: colors.text }}>{selectedTx.cat}</Text></View>
                  <View style={[styles.slipRow, { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 10, marginTop: 10 }]}>
                    <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 18 }}>Amount:</Text>
                    <Text style={{ color: selectedTx.amt > 0 ? '#2ecc71' : colors.text, fontWeight: 'bold', fontSize: 18 }}>
                      {selectedTx.amt > 0 ? '+' : ''}${Math.abs(selectedTx.amt).toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.slipStatus, { backgroundColor: '#e8f5e9' }]}>
                    <Text style={{ color: '#2ecc71', fontWeight: 'bold' }}>✅ COMPLETED</Text>
                  </View>
                  <TouchableOpacity style={styles.confirmBtn} onPress={shareTransactionSlip}>
                    <Text style={styles.btnText}>📤 Share Slip</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={[styles.cancelBtn, { marginTop: 15 }]} onPress={() => setSlipModal(false)}>
                <Text style={{ color: '#888' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={fraudModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: '#ffebee', height: '60%' }]}>
              <Text style={{ fontSize: 50, textAlign: 'center' }}>🚨</Text>
              <Text style={[styles.title, { color: '#d32f2f', textAlign: 'center', fontSize: 22 }]}>⚠️ Security Alert</Text>
              <Text style={{ color: '#333', textAlign: 'center', fontSize: 16, marginBottom: 20 }}>
                Our AI detected an unusual transaction pattern. Is this activity legitimate?
              </Text>
              <View style={[styles.suspiciousTx, { backgroundColor: '#fff', padding: 20, borderRadius: 15 }]}>
                <Text style={{ color: '#888' }}>Transaction Amount:</Text>
                <Text style={{ color: '#d32f2f', fontSize: 28, fontWeight: 'bold' }}>${pendingTx?.amount}</Text>
                <Text style={{ color: '#888', marginTop: 5 }}>Type: {pendingTx?.type}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                <TouchableOpacity style={[styles.fraudBtn, { backgroundColor: '#d32f2f' }]} onPress={() => handleFraudDecision(false)}>
                  <Text style={styles.btnText}>Block ❌</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.fraudBtn, { backgroundColor: '#2ecc71' }]} onPress={() => handleFraudDecision(true)}>
                  <Text style={styles.btnText}>Approve ✅</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={insightsModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff', height: '80%' }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setInsightsModal(false)}><Text style={{ color: 'red' }}>Close</Text></TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>AI Insights</Text>
                <View style={{ width: 40 }} />
              </View>
              <ScrollView style={{ marginTop: 20 }}>
                <View style={[styles.insightCard, { backgroundColor: isDark ? '#222' : '#f0f0f0' }]}>
                  <Text style={{ fontSize: 30 }}>📊</Text>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Spending Analysis</Text>
                  <View style={{ marginTop: 15 }}>
                    <View style={styles.rowBetween}><Text style={{ color: '#888' }}>Total Income:</Text><Text style={{ color: '#2ecc71', fontWeight: 'bold' }}>${insights.income.toLocaleString()}</Text></View>
                    <View style={styles.rowBetween}><Text style={{ color: '#888' }}>Total Spending:</Text><Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>-${insights.spending.toLocaleString()}</Text></View>
                    <View style={styles.rowBetween}><Text style={{ color: '#888' }}>Savings:</Text><Text style={{ color: '#2ecc71', fontWeight: 'bold' }}>${insights.savings.toLocaleString()}</Text></View>
                  </View>
                </View>
                <View style={[styles.insightCard, { backgroundColor: '#e8f5e9' }]}>
                  <Text style={{ fontSize: 30 }}>💡</Text>
                  <Text style={{ color: '#1b5e20', fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>AI Tip</Text>
                  <Text style={{ color: '#333', marginTop: 10, lineHeight: 22 }}>{insights.tip}</Text>
                </View>
                <View style={[styles.insightCard, { backgroundColor: isDark ? '#222' : '#f0f0f0' }]}>
                  <Text style={{ fontSize: 30 }}>🏆</Text>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>Your Badges</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
                    {badges.map(badge => (
                      <View key={badge.id} style={[styles.badge, { opacity: badge.earned ? 1 : 0.3 }]}>
                        <Text style={{ fontSize: 28 }}>{badge.icon}</Text>
                        <Text style={{ color: colors.text, fontSize: 10, marginTop: 5 }}>{badge.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal visible={savingsModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff', height: '70%' }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setSavingsModal(false)}><Text style={{ color: 'red' }}>Close</Text></TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>Savings Goals</Text>
                <View style={{ width: 40 }} />
              </View>
              <Text style={[styles.title, { color: colors.text, marginTop: 20, fontSize: 18 }]}>Create New Goal</Text>
              <TextInput placeholder="Goal Name (e.g., New Car)" style={[styles.inputField, { color: colors.text, fontSize: 18, marginVertical: 10 }]} value={newGoalName} onChangeText={setNewGoalName} />
              <TextInput placeholder="Target Amount" keyboardType="numeric" style={[styles.inputField, { color: colors.text, fontSize: 18, marginVertical: 10 }]} value={newGoalTarget} onChangeText={setNewGoalTarget} />
              <TouchableOpacity style={styles.confirmBtn} onPress={addSavingsGoal}>
                <Text style={styles.btnText}>Create Goal 🎯</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={billSplitModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff', height: '70%' }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setBillSplitModal(false)}><Text style={{ color: 'red' }}>Cancel</Text></TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>Split Bill</Text>
                <View style={{ width: 40 }} />
              </View>
              <TextInput placeholder="Bill Description" style={[styles.inputField, { color: colors.text, fontSize: 18 }]} value={splitDesc} onChangeText={setSplitDesc} />
              <TextInput placeholder="Total Bill Amount" keyboardType="numeric" style={[styles.inputField, { color: colors.text, fontSize: 18 }]} value={splitBillAmt} onChangeText={setSplitBillAmt} />
              <TouchableOpacity style={styles.confirmBtn} onPress={processBillSplit}>
                <Text style={styles.btnText}>Calculate Split 🔪</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={swapModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}><View style={[styles.sheet, {backgroundColor: isDark ? '#1A1A1A' : '#fff', height: '80%'}]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={()=>setSwapModal(false)}><Text style={{color:'red'}}>Cancel</Text></TouchableOpacity>
              <Text style={{color: colors.text, fontWeight: 'bold'}}>Step 1 of 2</Text>
              <View style={{width: 40}} />
            </View>
            <Text style={[styles.title, {color: colors.text, marginTop: 20}]}>Sell USD for {targetCurr.label}</Text>
            <TextInput placeholder="0.00" keyboardType="numeric" style={[styles.inputField, {color: colors.text}]} onChangeText={setInputAmt} value={inputAmt} autoFocus />
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20}}>
              {rates.map(r => (
                <TouchableOpacity key={r.label} onPress={() => setTargetCurr(r)} style={[styles.currBadge, {borderColor: targetCurr.label === r.label ? '#2ecc71' : '#444'}]}>
                  <Text style={{color: colors.text, fontWeight:'bold'}}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.convertBox}>
              <Text style={{color: '#888'}}>Estimated Received:</Text>
              <Text style={{color: '#2ecc71', fontSize: 32, fontWeight: 'bold'}}>{targetCurr.symbol}{(parseFloat(inputAmt || 0) * targetCurr.rate).toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => { if (!checkForFraud(parseFloat(inputAmt), 'Swap')) return; goToPin(); }}><Text style={styles.btnText}>Review Swap ❯</Text></TouchableOpacity>
          </View></View>
        </Modal>

        <Modal visible={pinModal} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}><View style={[styles.sheet, {backgroundColor: isDark ? '#1A1A1A' : '#fff', height: '50%'}]}>
            <TouchableOpacity onPress={goBackFromPin} style={{marginBottom: 20}}><Text style={{color: '#2ecc71', fontWeight: 'bold'}}>❮ Back to Edit</Text></TouchableOpacity>
            <Text style={[styles.title, {color: colors.text, textAlign: 'center'}]}>Enter Transaction PIN</Text>
            <TextInput placeholder="****" keyboardType="numeric" secureTextEntry maxLength={4} style={[styles.inputField, {color: colors.text, letterSpacing: 20}]} onChangeText={setInputPin} autoFocus />
            <TouchableOpacity style={styles.confirmBtn} onPress={finalizeTx}><Text style={styles.btnText}>Authorize & Execute</Text></TouchableOpacity>
          </View></View>
        </Modal>

        <Modal visible={receiptModal} animationType="bounce" transparent={true}>
          <View style={[styles.modalOverlay, {justifyContent: 'center', padding: 25}]}>
            <View style={[styles.receiptCard, {backgroundColor: isDark ? '#1A1A1A' : '#fff'}]}>
              <Text style={{fontSize: 50, textAlign: 'center'}}>🧾</Text>
              <Text style={[styles.title, {textAlign: 'center', color: '#2ecc71'}]}>Success!</Text>
              <View style={styles.receiptRow}><Text style={{color: '#888'}}>Operation:</Text><Text style={{color: colors.text}}>{activeAction}</Text></View>
              <View style={styles.receiptRow}><Text style={{color: '#888'}}>USD Amount:</Text><Text style={{color: colors.text}}>${lastTx.usd}</Text></View>
              {activeAction === 'Swap' && <View style={styles.receiptRow}><Text style={{color: '#888'}}>Received:</Text><Text style={{color: '#2ecc71', fontWeight: 'bold'}}>{targetCurr.symbol}{lastTx.received.toLocaleString()}</Text></View>}
              <View style={styles.receiptRow}><Text style={{color: '#888'}}>Points Earned:</Text><Text style={{color: '#f1c40f', fontWeight: 'bold'}}>+{activeAction === 'Add' ? 10 : 25}</Text></View>
              <TouchableOpacity style={[styles.confirmBtn, {marginTop: 30}]} onPress={() => {setReceiptModal(false); setInputAmt('');}}>
                <Text style={styles.btnText}>Return to Wallet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={amtModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}><View style={[styles.sheet, {backgroundColor: isDark ? '#1A1A1A' : '#fff'}]}>
            <Text style={[styles.title, {color: colors.text}]}>{activeAction} Funds</Text>
            <TextInput placeholder="0.00" keyboardType="numeric" style={[styles.inputField, {color: colors.text}]} onChangeText={setInputAmt} autoFocus />
            <TouchableOpacity style={styles.confirmBtn} onPress={() => { if (!checkForFraud(parseFloat(inputAmt), activeAction)) return; goToPin(); }}><Text style={styles.btnText}>Continue</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setAmtModal(false)}><Text style={{color:'red', textAlign:'center', marginTop: 15}}>Cancel</Text></TouchableOpacity>
          </View></View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

function CardScreen() {
  const { colors, isDark } = useContext(ThemeContext);
  const [showFull, setShowFull] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const gradientColors = isDark ? ['#0f0c29', '#302b63', '#24243e'] : ['#f5f7fa', '#c3cfe2', '#e8eff5'];
  
  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <ScrollView contentContainerStyle={{ padding: 25 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Management</Text>
          <View style={[styles.masterCard, { opacity: isFrozen ? 0.4 : 1 }]}>
            <View style={styles.rowBetween}><Text style={styles.cardType}>PLATINUM VIRTUAL</Text><Text style={styles.brandLogo}>mastercard</Text></View>
            <View style={{ marginVertical: 35 }}><Text style={styles.cardHolder}>ELITE MEMBER</Text><Text style={styles.cardDigits}>{showFull ? "5412 7500 1234 8821" : "**** **** **** 8821"}</Text></View>
            <View style={styles.row}><View style={{ marginRight: 40 }}><Text style={styles.tinyLabel}>EXPIRY</Text><Text style={styles.cardInfo}>09/27</Text></View><View><Text style={styles.tinyLabel}>CVV</Text><Text style={styles.cardInfo}>{showFull ? "415" : "***"}</Text></View></View>
          </View>
          <TouchableOpacity style={styles.revealBtn} onPress={() => setShowFull(!showFull)}><Text style={{ color: '#2ecc71', fontWeight: 'bold' }}>{showFull ? "Hide Private Details" : "Reveal Card Numbers"}</Text></TouchableOpacity>
          <Text style={[styles.subLabel, { marginTop: 40 }]}>CONTROLS</Text>
          <View style={[styles.groupCard, { backgroundColor: isDark ? '#111' : '#fff' }]}>
            <View style={styles.settingRowSimple}><View style={styles.row}><Text style={{ marginRight: 10 }}>❄️</Text><Text style={{ color: colors.text, fontWeight: '600' }}>Freeze Card</Text></View><Switch value={isFrozen} onValueChange={setIsFrozen} trackColor={{ true: '#2ecc71' }} /></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function StockScreen() {
  const { colors, isDark } = useContext(ThemeContext);
  const [balance, setBalance] = useState(14250.60);
  
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.52, change: 2.35, changePercent: 1.33, owned: 0 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.85, changePercent: -0.60, owned: 0 },
    { symbol: 'MSFT', name: 'Microsoft', price: 378.91, change: 4.12, changePercent: 1.10, owned: 5 },
    { symbol: 'AMZN', name: 'Amazon', price: 178.25, change: 1.56, changePercent: 0.88, owned: 0 },
    { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: -5.20, changePercent: -2.05, owned: 2 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 495.22, change: 12.45, changePercent: 2.58, owned: 0 },
  ]);
  
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeModal, setTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState('buy');
  const [tradeQuantity, setTradeQuantity] = useState('1');
  const [receiptModal, setReceiptModal] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);
  const [processingModal, setProcessingModal] = useState(false);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const randomChange = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(1, stock.price + randomChange);
        const newChange = stock.change + randomChange;
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(((newChange / stock.price) * 100).toFixed(2))
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (stock, type) => {
    setSelectedStock(stock);
    setTradeType(type);
    setTradeQuantity('1');
    setTradeModal(true);
  };

  const executeTrade = () => {
    const qty = parseInt(tradeQuantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Error", "Please enter a valid quantity.");
      return;
    }
    
    const totalCost = selectedStock.price * qty;
    
    if (tradeType === 'buy' && totalCost > balance) {
      Alert.alert("Insufficient Funds", "You don't have enough balance to buy this stock.");
      return;
    }
    
    if (tradeType === 'sell') {
      const ownedStock = stocks.find(s => s.symbol === selectedStock.symbol);
      if (qty > ownedStock.owned) {
        Alert.alert("Insufficient Shares", `You only own ${ownedStock.owned} shares of ${selectedStock.symbol}.`);
        return;
      }
    }
    
    setTradeModal(false);
    setProcessingModal(true);
    
    setTimeout(() => {
      setProcessingModal(false);
      
      const tradeResult = {
        id: Date.now().toString(),
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        type: tradeType,
        quantity: qty,
        price: selectedStock.price,
        total: tradeType === 'buy' ? -totalCost : totalCost,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        ref: 'STK-' + Date.now().toString().slice(-8)
      };
      
      setLastTrade(tradeResult);
      
      if (tradeType === 'buy') {
        setBalance(prev => prev - totalCost);
        setStocks(prev => prev.map(s => 
          s.symbol === selectedStock.symbol 
            ? { ...s, owned: s.owned + qty }
            : s
        ));
      } else {
        setBalance(prev => prev + totalCost);
        setStocks(prev => prev.map(s => 
          s.symbol === selectedStock.symbol 
            ? { ...s, owned: s.owned - qty }
            : s
        ));
      }
      
      setPortfolio(prev => [tradeResult, ...prev]);
      setReceiptModal(true);
      
    }, 1500);
  };

  const shareReceipt = async () => {
    if (!lastTrade) return;
    const receiptText = `
🧾 POCKET WISE STOCK TRADE RECEIPT
===================================
Reference: ${lastTrade.ref}
Date: ${lastTrade.date}
Time: ${lastTrade.time}
--------------------------------
Stock: ${lastTrade.symbol} (${lastTrade.name})
Type: ${lastTrade.type.toUpperCase()}
Quantity: ${lastTrade.quantity} shares
Price: $${lastTrade.price.toFixed(2)}
Total: $${Math.abs(lastTrade.total).toFixed(2)}
Status: ✅ COMPLETED
--------------------------------
Thank you for trading with Pocket Wise!
    `;
    try {
      await Share.share({ message: receiptText, title: 'Stock Trade Receipt - ' + lastTrade.ref });
    } catch (error) {
      Alert.alert("Error", "Could not share receipt");
    }
  };

  const gradientColors = isDark ? ['#0f0c29', '#302b63', '#24243e'] : ['#f5f7fa', '#c3cfe2', '#e8eff5'];
  
  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📈 Stock Market</Text>
          
          <View style={[styles.rowBetween, { marginBottom: 15 }]}>
            <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
              <Text style={{ color: '#888', fontSize: 12 }}>Available Balance</Text>
              <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>${balance.toLocaleString()}</Text>
            </View>
            <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
              <Text style={{ color: '#888', fontSize: 12 }}>Portfolio Value</Text>
              <Text style={{ color: '#2ecc71', fontSize: 24, fontWeight: 'bold' }}>${stocks.reduce((sum, s) => sum + (s.price * s.owned), 0).toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.liveDot, { backgroundColor: '#2ecc71' }]} />
            <Text style={{ color: '#2ecc71', fontSize: 12 }}>LIVE MARKET</Text>
          </View>

          <Text style={[styles.subLabel, { color: colors.text, marginTop: 20, marginBottom: 15 }]}>📊 Market Stocks</Text>
          
          {stocks.map(stock => (
            <TouchableOpacity 
              key={stock.symbol} 
              style={[styles.stockRow, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
              onPress={() => setSelectedStock(stock)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>{stock.symbol}</Text>
                <Text style={{ color: '#888', fontSize: 12 }}>{stock.name}</Text>
                {stock.owned > 0 && (
                  <Text style={{ color: '#2ecc71', fontSize: 11, marginTop: 4 }}>Owned: {stock.owned} shares</Text>
                )}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>${stock.price}</Text>
                <Text style={{ color: stock.change >= 0 ? '#2ecc71' : '#e74c3c', fontSize: 13 }}>
                  {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 15 }}>
                <TouchableOpacity 
                  style={[styles.tradeBtn, { backgroundColor: '#2ecc71', marginRight: 8 }]}
                  onPress={() => handleTrade(stock, 'buy')}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>BUY</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tradeBtn, { backgroundColor: '#e74c3c' }]}
                  onPress={() => handleTrade(stock, 'sell')}
                  disabled={stock.owned === 0}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>SELL</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {portfolio.length > 0 && (
            <>
              <Text style={[styles.subLabel, { color: colors.text, marginTop: 30, marginBottom: 15 }]}>📋 Trade History</Text>
              {portfolio.slice(0, 5).map(trade => (
                <View key={trade.id} style={[styles.stockRow, { backgroundColor: isDark ? '#1a1a1a' : '#fff', padding: 12 }]}>
                  <View>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{trade.symbol}</Text>
                    <Text style={{ color: '#888', fontSize: 11 }}>{trade.type.toUpperCase()} {trade.quantity} @ ${trade.price}</Text>
                  </View>
                  <Text style={{ color: trade.total > 0 ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>
                    {trade.total > 0 ? '+' : ''}${Math.abs(trade.total).toFixed(2)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>

        <Modal visible={tradeModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setTradeModal(false)}><Text style={{ color: 'red' }}>Cancel</Text></TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{tradeType.toUpperCase()} {selectedStock?.symbol}</Text>
                <View style={{ width: 40 }} />
              </View>
              
              {selectedStock && (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <Text style={{ color: colors.text, fontSize: 14 }}>{selectedStock.name}</Text>
                  <Text style={{ color: colors.text, fontSize: 36, fontWeight: 'bold', marginVertical: 10 }}>${selectedStock.price}</Text>
                  <Text style={{ color: selectedStock.change >= 0 ? '#2ecc71' : '#e74c3c', fontSize: 16 }}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change} ({selectedStock.changePercent}%)
                  </Text>
                  
                  <View style={{ marginTop: 30, width: '100%' }}>
                    <Text style={{ color: '#888', marginBottom: 10 }}>Quantity:</Text>
                    <TextInput 
                      value={tradeQuantity}
                      onChangeText={setTradeQuantity}
                      keyboardType="numeric"
                      style={[styles.inputField, { fontSize: 32, color: colors.text, marginVertical: 10 }]}
                    />
                    
                    <View style={[styles.slipRow, { marginTop: 10 }]}>
                      <Text style={{ color: '#888' }}>Total:</Text>
                      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 24 }}>
                        ${(parseInt(tradeQuantity || 0) * selectedStock.price).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.confirmBtn, { marginTop: 30, width: '100%', backgroundColor: tradeType === 'buy' ? '#2ecc71' : '#e74c3c' }]}
                    onPress={executeTrade}
                  >
                    <Text style={styles.btnText}>{tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        <Modal visible={processingModal} animationType="fade" transparent={true}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }]}>
            <View style={[styles.receiptCard, { backgroundColor: isDark ? '#1A1A1A' : '#fff', padding: 40 }]}>
              <Text style={{ fontSize: 50, textAlign: 'center' }}>⏳</Text>
              <Text style={{ color: colors.text, fontSize: 18, marginTop: 20, textAlign: 'center' }}>Processing Trade...</Text>
            </View>
          </View>
        </Modal>

        <Modal visible={receiptModal} animationType="bounce" transparent={true}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', padding: 25 }]}>
            <View style={[styles.receiptCard, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
              <Text style={{ fontSize: 40, textAlign: 'center' }}>✅</Text>
              <Text style={[styles.title, { textAlign: 'center', color: '#2ecc71' }]}>Trade Successful!</Text>
              
              {lastTrade && (
                <>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Reference:</Text><Text style={{ color: colors.text, fontWeight: 'bold' }}>{lastTrade.ref}</Text></View>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Stock:</Text><Text style={{ color: colors.text }}>{lastTrade.symbol}</Text></View>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Type:</Text><Text style={{ color: lastTrade.type === 'buy' ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{lastTrade.type.toUpperCase()}</Text></View>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Quantity:</Text><Text style={{ color: colors.text }}>{lastTrade.quantity} shares</Text></View>
                  <View style={styles.slipRow}><Text style={{ color: '#888' }}>Price:</Text><Text style={{ color: colors.text }}>${lastTrade.price.toFixed(2)}</Text></View>
                  <View style={[styles.slipRow, { borderTopWidth: 1, borderColor: '#ccc', paddingTop: 10, marginTop: 10 }]}>
                    <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 16 }}>Total:</Text>
                    <Text style={{ color: lastTrade.total > 0 ? '#2ecc71' : '#e74c3c', fontWeight: 'bold', fontSize: 16 }}>
                      {lastTrade.total > 0 ? '+' : ''}${Math.abs(lastTrade.total).toFixed(2)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity style={[styles.confirmBtn, { marginTop: 20 }]} onPress={shareReceipt}>
                    <Text style={styles.btnText}>📤 Share Receipt</Text>
                  </TouchableOpacity>
                </>
              )}
              
              <TouchableOpacity style={[styles.cancelBtn, { marginTop: 15 }]} onPress={() => setReceiptModal(false)}>
                <Text style={{ color: '#888' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

function NotificationsScreen() {
  const { colors, isDark } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'success', title: 'Payment Successful', desc: 'Sent $50.00 to John', time: '2 min ago', read: false },
    { id: '2', type: 'alert', title: 'Security Alert', desc: 'New device logged in', time: '1 hour ago', read: false },
    { id: '3', type: 'info', title: 'Points Earned', desc: 'You earned 25 points!', time: '3 hours ago', read: true },
    { id: '4', type: 'success', title: 'Deposit Received', desc: '$500.00 added to wallet', time: 'Yesterday', read: true },
  ]);
  const [filter, setFilter] = useState('all');

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type) => {
    switch(type) { case 'success': return '✅'; case 'alert': return '🚨'; case 'info': return 'ℹ️'; default: return '📌'; }
  };

  const getColor = (type) => {
    switch(type) { case 'success': return '#2ecc71'; case 'alert': return '#e74c3c'; case 'info': return '#3498db'; default: return '#888'; }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🔔 Notifications</Text>
        
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          {['all', 'unread'].map(f => (
            <TouchableOpacity 
              key={f}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: filter === f ? '#2ecc71' : (isDark ? '#222' : '#f0f0f0'), marginRight: 8 }}
              onPress={() => setFilter(f)}
            >
              <Text style={{ color: filter === f ? '#fff' : colors.text, fontSize: 12, textTransform: 'capitalize' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {(filter === 'all' ? notifications : notifications.filter(n => !n.read)).map(notif => (
          <TouchableOpacity 
            key={notif.id}
            style={[styles.notifCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderLeftColor: getColor(notif.type) }]}
            onPress={() => markAsRead(notif.id)}
          >
            <Text style={{ fontSize: 24 }}>{getIcon(notif.type)}</Text>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{notif.title}</Text>
                {!notif.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ecc71' }} />}
              </View>
              <Text style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{notif.desc}</Text>
              <Text style={{ color: '#666', fontSize: 11, marginTop: 6 }}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Settings() {
  const { isDark, toggleTheme, colors } = useContext(ThemeContext);
  const user = auth.currentUser;
  
  // Modal states
  const [securityModal, setSecurityModal] = useState(false);
  const [changePinModal, setChangePinModal] = useState(false);
  const [backupModal, setBackupModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [privacyModeModal, setPrivacyModeModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [autoLockModal, setAutoLockModal] = useState(false);
  
  // Settings states
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [transactionSounds, setTransactionSounds] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [locationTracking, setLocationTracking] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState('5');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [iCloudBackup, setICloudBackup] = useState(true);
  const [lastBackup, setLastBackup] = useState('Today');
  
  // PIN change states
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  // Login history
  const [loginHistory] = useState([
    { id: '1', device: 'iPhone 14 Pro', location: 'New York, US', time: '2 hours ago', status: 'success' },
    { id: '2', device: 'MacBook Pro', location: 'New York, US', time: 'Yesterday', status: 'success' },
    { id: '3', device: 'iPhone 13', location: 'Los Angeles, US', time: '3 days ago', status: 'success' },
  ]);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    saveSettings();
  }, [biometricLogin, twoFactorAuth, transactionSounds, hapticFeedback, locationTracking, analytics, pushNotifications, autoLock, autoLockTime, privacyMode, iCloudBackup]);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setBiometricLogin(parsed.biometricLogin || false);
        setTwoFactorAuth(parsed.twoFactorAuth !== false);
        setTransactionSounds(parsed.transactionSounds !== false);
        setHapticFeedback(parsed.hapticFeedback !== false);
        setLocationTracking(parsed.locationTracking || false);
        setAnalytics(parsed.analytics !== false);
        setPushNotifications(parsed.pushNotifications !== false);
        setAutoLock(parsed.autoLock !== false);
        setAutoLockTime(parsed.autoLockTime || '5');
        setPrivacyMode(parsed.privacyMode || false);
        setICloudBackup(parsed.iCloudBackup !== false);
        setLastBackup(parsed.lastBackup || 'Never');
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        biometricLogin, twoFactorAuth, transactionSounds, hapticFeedback,
        locationTracking, analytics, pushNotifications, autoLock, autoLockTime,
        privacyMode, iCloudBackup, lastBackup
      };
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const handleChangePin = async () => {
    if (currentPin.length !== 4) { Alert.alert("Error", "Current PIN must be 4 digits."); return; }
    if (newPin.length !== 4) { Alert.alert("Error", "New PIN must be 4 digits."); return; }
    if (newPin !== confirmPin) { Alert.alert("Error", "New PINs do not match."); return; }
    if (currentPin !== '1234') { Alert.alert("Error", "Current PIN is incorrect."); return; }
    await AsyncStorage.setItem('userPin', newPin);
    Alert.alert("Success", "PIN changed successfully!");
    setChangePinModal(false);
    setCurrentPin(''); setNewPin(''); setConfirmPin('');
  };

  const handleExportData = async () => {
    try {
      const exportData = `POCKET WISE DATA EXPORT\n======================\nExport Date: ${new Date().toLocaleDateString()}\nUser ID: ${user?.uid?.slice(0, 10).toUpperCase() || 'GUEST'}\n\nSettings:\nTwo-Factor Auth: ${twoFactorAuth ? 'Enabled' : 'Disabled'}\nBiometric: ${biometricLogin ? 'Enabled' : 'Disabled'}\nPush: ${pushNotifications ? 'Enabled' : 'Disabled'}`;
      await Share.share({ message: exportData, title: 'Pocket Wise Data Export' });
      setExportModal(false);
    } catch (error) { Alert.alert("Error", "Failed to export data."); }
  };

  const handleBackup = async () => {
    Alert.alert("Backup", "Starting backup...", [
      { text: "Cancel", style: "cancel" },
      { text: "Backup Now", onPress: async () => {
        const now = new Date().toLocaleString();
        setLastBackup(now);
        await AsyncStorage.setItem('lastBackup', now);
        Alert.alert("Success", "Backup completed!");
      }}
    ]);
  };

  const handleClearCache = () => {
    Alert.alert("Clear Cache", "This will clear all cached data. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: async () => {
        try { await AsyncStorage.clear(); Alert.alert("Success", "Cache cleared!"); }
        catch (error) { Alert.alert("Error", "Failed to clear cache."); }
      }}
    ]);
  };

  const handleOpenLink = async (url) => { try { await WebBrowser.openBrowserAsync(url); } catch { Alert.alert("Error", "Could not open link."); } };
  const handleCallSupport = () => { Linking.openURL('tel:+18001234567').catch(() => Alert.alert("Error", "Could not make call.")); };
  const handleEmailSupport = () => { Linking.openURL('mailto:support@pocketwise.com?subject=Support').catch(() => Alert.alert("Error", "Could not open email.")); };
  const handleLiveChat = () => { WebBrowser.openBrowserAsync('https://pocketwise.com/chat'); };

  const SettingItem = ({ icon, title, subtitle, value, onValueChange, type = "switch", onPress }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>{title}</Text>
          {subtitle && <Text style={{ color: '#888', fontSize: 11 }}>{subtitle}</Text>}
        </View>
      </View>
      {type === "switch" && <Switch value={value} onValueChange={onValueChange} trackColor={{ true: '#2ecc71' }} />}
      {type === "arrow" && <Text style={{ color: '#888' }}>❯</Text>}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title, icon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 8, marginLeft: 5 }}>
      <Text style={{ fontSize: 14 }}>{icon}</Text>
      <Text style={{ color: '#888', fontSize: 11, fontWeight: 'bold', marginLeft: 6, textTransform: 'uppercase' }}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[styles.profileHeader, { marginBottom: 10 }]}>
          <View style={styles.avatarCircle}><Text style={{ fontSize: 40 }}>👤</Text></View>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 5 }]}>Elite Profile</Text>
          <Text style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: 12 }}>ID: {user?.uid?.slice(0, 10).toUpperCase() || 'GUEST'}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <View style={{ backgroundColor: '#2ecc71', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontSize: 10 }}>⭐ Premium</Text>
            </View>
            <View style={{ backgroundColor: '#3498db', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginLeft: 8 }}>
              <Text style={{ color: '#fff', fontSize: 10 }}>🔒 Verified</Text>
            </View>
          </View>
        </View>

        <SectionHeader title="Security" icon="🔐" />
        <SettingItem icon="🔑" title="Change PIN" subtitle="Update transaction PIN" type="arrow" onPress={() => setChangePinModal(true)} />
        <SettingItem icon="🔒" title="Two-Factor Auth" subtitle={twoFactorAuth ? "Extra security layer (Enabled)" : "Extra security layer (Disabled)"} value={twoFactorAuth} onValueChange={(val) => { setTwoFactorAuth(val); Alert.alert("Two-Factor Auth", val ? "2FA enabled!" : "2FA disabled."); }} />
        <SettingItem icon="👆" title="Biometric Login" subtitle={biometricLogin ? "Fingerprint/Face ID (Enabled)" : "Fingerprint/Face ID (Disabled)"} value={biometricLogin} onValueChange={(val) => { setBiometricLogin(val); Alert.alert("Biometric", val ? "Biometric login enabled!" : "Biometric login disabled."); }} />
        <SettingItem icon="⏰" title="Auto-Lock" subtitle={autoLock ? `Lock after ${autoLockTime} min` : "Disabled"} value={autoLock} onValueChange={(val) => { setAutoLock(val); if(val) setAutoLockModal(true); }} />
        <SettingItem icon="🔍" title="Login History" subtitle="View recent logins" type="arrow" onPress={() => setSecurityModal(true)} />

        <SectionHeader title="Notifications" icon="🔔" />
        <SettingItem icon="📱" title="Push Notifications" subtitle={pushNotifications ? "Receive notifications" : "Notifications disabled"} value={pushNotifications} onValueChange={setPushNotifications} />
        <SettingItem icon="🔊" title="Transaction Sounds" subtitle={transactionSounds ? "Play sounds" : "Sounds disabled"} value={transactionSounds} onValueChange={(val) => { setTransactionSounds(val); if(val) Vibration.vibrate(100); }} />
        <SettingItem icon="📳" title="Haptic Feedback" subtitle={hapticFeedback ? "Vibrate on actions" : "Haptic disabled"} value={hapticFeedback} onValueChange={(val) => { setHapticFeedback(val); if(val) Vibration.vibrate(100); }} />

        <SectionHeader title="Appearance" icon="🎨" />
        <SettingItem icon={isDark ? "🌙" : "☀️"} title={isDark ? "Dark Mode" : "Light Mode"} subtitle={isDark ? "Currently using dark theme" : "Currently using light theme"} value={isDark} onValueChange={toggleTheme} />

        <SectionHeader title="Privacy" icon="🔒" />
        <SettingItem icon="📍" title="Location Tracking" subtitle={locationTracking ? "Location enabled" : "Location disabled"} value={locationTracking} onValueChange={(val) => { setLocationTracking(val); Alert.alert("Location", val ? "Location tracking enabled!" : "Location tracking disabled."); }} />
        <SettingItem icon="📊" title="Analytics" subtitle={analytics ? "Analytics enabled" : "Analytics disabled"} value={analytics} onValueChange={setAnalytics} />
        <SettingItem icon="👁️" title="Privacy Mode" subtitle={privacyMode ? "Balance is hidden" : "Show balance"} type="arrow" onPress={() => setPrivacyModeModal(true)} />

        <SectionHeader title="Data & Storage" icon="💾" />
        <SettingItem icon="📤" title="Export Data" subtitle="Download your data" type="arrow" onPress={() => setExportModal(true)} />
        <SettingItem icon="🗑️" title="Clear Cache" subtitle="Clear cached data" type="arrow" onPress={handleClearCache} />
        <SettingItem icon="☁️" title="Backup & Sync" subtitle={`Last backup: ${lastBackup}`} type="arrow" onPress={() => setBackupModal(true)} />

        <SectionHeader title="Support" icon="🎧" />
        <SettingItem icon="💬" title="Live Chat" type="arrow" onPress={handleLiveChat} />
        <SettingItem icon="📞" title="Call Support" type="arrow" onPress={handleCallSupport} />
        <SettingItem icon="📧" title="Email Support" type="arrow" onPress={handleEmailSupport} />

        <SectionHeader title="About" icon="ℹ️" />
        <SettingItem icon="📖" title="Terms of Service" type="arrow" onPress={() => handleOpenLink('https://pocketwise.com/terms')} />
        <SettingItem icon="🔒" title="Privacy Policy" type="arrow" onPress={() => handleOpenLink('https://pocketwise.com/privacy')} />
        <SettingItem icon="ℹ️" title="App Version" subtitle="v1.0.0 (Build 2024.01)" type="arrow" onPress={() => setAboutModal(true)} />

        <TouchableOpacity style={[styles.logoutBtn, { marginTop: 30 }]} onPress={() => signOut(auth)}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>🚪 Secure Logout</Text>
        </TouchableOpacity>

        <Modal visible={securityModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setSecurityModal(false)}><Text style={{ color: 'red' }}>Close</Text></TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>Security</Text>
                <View style={{ width: 40 }} />
              </View>
              <TouchableOpacity style={styles.settingItem}><Text style={{ color: colors.text }}>🔑 Change PIN</Text><Text style={{ color: '#888' }}>❯</Text></TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}><Text style={{ color: colors.text }}>🔐 Enable 2FA</Text><Text style={{ color: '#888' }}>❯</Text></TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}><Text style={{ color: colors.text }}>📱 Trusted Devices</Text><Text style={{ color: '#888' }}>❯</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={backupModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setBackupModal(false)}><Text style={{ color: 'red' }}>Close</Text></TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>Backup</Text>
                <View style={{ width: 40 }} />
              </View>
              <Text style={{ color: colors.text, marginTop: 20 }}>☁️ iCloud Backup</Text>
              <Switch value={true} trackColor={{ true: '#2ecc71' }} />
              <Text style={{ color: '#888', marginTop: 10 }}>Last backup: Today</Text>
              <TouchableOpacity style={[styles.confirmBtn, { marginTop: 20 }]} onPress={() => { Alert.alert("Success", "Backup completed!"); setBackupModal(false); }}>
                <Text style={styles.btnText}>Backup Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={aboutModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.sheet, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setAboutModal(false)}><Text style={{ color: 'red' }}>Close</Text></TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>About</Text>
                <View style={{ width: 40 }} />
              </View>
              <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text style={{ fontSize: 60 }}>💰</Text>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>Pocket Wise</Text>
                <Text style={{ color: '#2ecc71', marginTop: 5 }}>Version 1.0.0</Text>
                <Text style={{ color: '#888', marginTop: 20 }}>Your Secure Fintech Ecosystem</Text>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: { height: 80, paddingBottom: 20, borderTopWidth: 0, elevation: 0 }, tabBarActiveTintColor: '#2ecc71', headerShown: false }}>
      <Tab.Screen name="Wallet" component={Dashboard} />
      <Tab.Screen name="Stocks" component={StockScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      <Tab.Screen name="Cards" component={CardScreen} />
      <Tab.Screen name="Profile" component={Settings} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u)); return unsubscribe; }, []);
  
  const theme = useMemo(() => ({ 
    isDark, 
    toggleTheme: () => setIsDark(!isDark), 
    colors: isDark ? { 
      background: '#0f0c29', 
      backgroundEnd: '#302b63', 
      backgroundMid: '#24243e',
      text: '#fff',
      card: '#1a1a2e',
      cardGradient: ['#1a1a2e', '#16213e']
    } : { 
      background: '#f5f7fa',
      backgroundEnd: '#c3cfe2',
      backgroundMid: '#e8eff5',
      text: '#1A1A1A',
      card: '#ffffff',
      cardGradient: ['#667eea', '#764ba2']
    } 
  }), [isDark]);
  
  return (
    <ThemeContext.Provider value={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? <Stack.Screen name="Auth" component={AuthScreen} /> : <Stack.Screen name="Main" component={MainTabs} />}
      </Stack.Navigator>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  authHeader: { alignItems: 'center', marginBottom: 30 }, logoImage: { width: 120, height: 120, marginBottom: 20 }, logoText: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  biometricBtn: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#2ecc71', justifyContent: 'center', alignItems: 'center', elevation: 20 },
  pulseRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: '#2ecc71', opacity: 0.3 },
  authenticatingOverlay: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  premiumCard: { margin: 20, padding: 30, borderRadius: 30, backgroundColor: '#111', height: 210, justifyContent: 'space-between', elevation: 15 },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' }, mainBalance: { color: '#fff', fontSize: 38, fontWeight: 'bold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' }, cardNumber: { color: '#fff', letterSpacing: 2, fontSize: 13 }, cardExpiry: { color: '#fff', opacity: 0.5, fontSize: 11 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }, actionItem: { alignItems: 'center' },
  actionIcon: { width: 60, height: 60, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 5 }, actionText: { marginTop: 10, fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 18 }, transCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 22, marginBottom: 14, elevation: 1 },
  row: { flexDirection: 'row', alignItems: 'center' }, rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(150,150,150,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transTitle: { fontWeight: '800', fontSize: 14 }, transSub: { color: '#888', fontSize: 11 }, transAmt: { fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 20, borderRadius: 22, alignItems: 'center', marginTop: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: { padding: 35, borderTopLeftRadius: 35, borderTopRightRadius: 35, height: '60%' },
  inputField: { fontSize: 45, fontWeight: 'bold', textAlign: 'center', marginVertical: 40, borderBottomWidth: 3, paddingBottom: 15 },
  confirmBtn: { backgroundColor: '#2ecc71', padding: 22, borderRadius: 22, alignItems: 'center' }, btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  cancelBtn: { alignSelf: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 }, masterCard: { height: 200, borderRadius: 25, backgroundColor: '#111', padding: 25, elevation: 10 },
  cardDigits: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 }, cardHolder: { color: '#fff', fontSize: 12, opacity: 0.8 },
  tinyLabel: { color: '#fff', fontSize: 8, opacity: 0.5 }, cardInfo: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  revealBtn: { marginTop: 20, alignSelf: 'center' }, subLabel: { fontSize: 10, fontWeight: '900', color: '#888', marginBottom: 10, marginLeft: 5 },
  groupCard: { borderRadius: 25, paddingVertical: 5, marginBottom: 20 },
  settingRowSimple: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  profileHeader: { alignItems: 'center', marginBottom: 30 }, avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(150,150,150,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  currBadge: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 15, borderWidth: 2, backgroundColor: 'rgba(150,150,150,0.1)' },
  convertBox: { backgroundColor: 'rgba(150,150,150,0.05)', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 30 },
  cardType: { color: '#fff', fontSize: 10, fontWeight: '900', opacity: 0.6 },
  brandLogo: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontStyle: 'italic' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptCard: { padding: 30, borderRadius: 30, elevation: 20 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, borderBottomWidth: 0.5, borderColor: 'rgba(150,150,150,0.1)', paddingBottom: 5 },
  supportOption: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 18, marginBottom: 12 },
  pointsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, marginHorizontal: 20, marginTop: 10, borderRadius: 15, elevation: 5 },
  savingsSection: { elevation: 5 },
  progressBar: { height: 8, borderRadius: 4, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#2ecc71', borderRadius: 4 },
  roundUpToggle: { borderTopWidth: 1, borderColor: 'rgba(150,150,150,0.2)', paddingTop: 10 },
  fraudBtn: { flex: 1, padding: 18, borderRadius: 15, alignItems: 'center', marginHorizontal: 5 },
  suspiciousTx: { alignItems: 'center', elevation: 3 },
  insightCard: { padding: 20, borderRadius: 20, marginBottom: 15, elevation: 3 },
  badge: { alignItems: 'center', margin: 10, width: 70 },
  authContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  authCard: { borderRadius: 25, padding: 25, marginTop: 30, elevation: 10 },
  authTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 5 },
  authInput: { padding: 15, borderRadius: 15, fontSize: 16 },
  forgotPassword: { color: '#2ecc71', textAlign: 'right', marginTop: 10, fontWeight: '600' },
  authBtn: { backgroundColor: '#2ecc71', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  authBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  switchMode: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchModeText: { color: '#2ecc71', fontWeight: 'bold' },
  guestBtn: { marginTop: 30, alignSelf: 'center', padding: 15 },
  guestBtnText: { color: '#888', fontSize: 16 },
  stockSection: { marginTop: 10 },
  liveDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  stockCard: { padding: 15, borderRadius: 15, marginRight: 12, minWidth: 100, alignItems: 'center' },
  slipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  slipStatus: { padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  portfolioCard: { padding: 20, borderRadius: 20, marginBottom: 20 },
  stockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 10 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
  notifCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 10, borderLeftWidth: 4 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 8 },
  settingItemLeft: { flexDirection: 'row', alignItems: 'center' },
  badgeSmall: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }
});
