import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Format number with commas
  const formatNumber = (num) => {
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Handle number button press
  const handleNumberPress = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  // Handle operator button press
  const handleOperatorPress = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setExpression(formatNumber(inputValue) + ' ' + nextOperator);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = performCalculation(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setExpression(formatNumber(newValue) + ' ' + nextOperator);
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  // Perform calculation based on operator
  const performCalculation = (firstValue, secondValue, operator) => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '−':
      case '-':
        return firstValue - secondValue;
      case '×':
      case '*':
        return firstValue * secondValue;
      case '÷':
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 'Error';
      default:
        return secondValue;
    }
  };

  // Handle equals button press
  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = performCalculation(previousValue, inputValue, operation);
      
      if (result === 'Error') {
        setDisplay('Error');
        setExpression('');
      } else {
        setExpression(formatNumber(previousValue) + ' ' + operation + ' ' + formatNumber(inputValue));
        setDisplay(String(result));
      }
      
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  // Handle clear button press
  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  // Handle toggle sign (+/-)
  const handleToggleSign = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(value * -1));
    }
  };

  // Handle percentage
  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  // Handle decimal point
  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Render calculator button
  const renderButton = (content, onPress, style = {}) => (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, style.textStyle]}>{content}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Display Area */}
      <View style={styles.displayContainer}>
        <Text style={styles.expressionText} numberOfLines={1} adjustsFontSizeToFit>
          {expression || ' '}
        </Text>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {formatNumber(display)}
        </Text>
      </View>

      {/* Button Grid */}
      <View style={styles.buttonContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          {renderButton('C', handleClear, styles.functionButton)}
          {renderButton('±', handleToggleSign, styles.functionButton)}
          {renderButton('%', handlePercentage, styles.functionButton)}
          {renderButton('÷', () => handleOperatorPress('÷'), styles.operatorButton)}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderButton('7', () => handleNumberPress(7))}
          {renderButton('8', () => handleNumberPress(8))}
          {renderButton('9', () => handleNumberPress(9))}
          {renderButton('×', () => handleOperatorPress('×'), styles.operatorButton)}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderButton('4', () => handleNumberPress(4))}
          {renderButton('5', () => handleNumberPress(5))}
          {renderButton('6', () => handleNumberPress(6))}
          {renderButton('−', () => handleOperatorPress('−'), styles.operatorButton)}
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          {renderButton('1', () => handleNumberPress(1))}
          {renderButton('2', () => handleNumberPress(2))}
          {renderButton('3', () => handleNumberPress(3))}
          {renderButton('+', () => handleOperatorPress('+'), styles.operatorButton)}
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          {renderButton('0', () => handleNumberPress(0), styles.zeroButton)}
          {renderButton('.', handleDecimal)}
          {renderButton('=', handleEquals, styles.equalsButton)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17171c',
  },
  displayContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 60,
    backgroundColor: '#17171c',
  },
  expressionText: {
    fontSize: 24,
    color: '#a5a5a5',
    fontWeight: '300',
    marginBottom: 8,
  },
  displayText: {
    fontSize: 64,
    color: '#ffffff',
    fontWeight: '200',
  },
  buttonContainer: {
    flex: 5,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#17171c',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#2e2f38',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderRadius: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '300',
  },
  functionButton: {
    backgroundColor: '#4e505f',
  },
  operatorButton: {
    backgroundColor: '#ff9f0a',
  },
  equalsButton: {
    backgroundColor: '#ff9f0a',
  },
  zeroButton: {
    flex: 2,
    marginRight: 6,
  },
});
