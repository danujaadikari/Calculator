import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

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
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = performCalculation(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  // Perform calculation based on operator
  const performCalculation = (firstValue, secondValue, operator) => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
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
      } else {
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
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
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
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* Button Grid */}
      <View style={styles.buttonContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          {renderButton('C', handleClear, styles.functionButton)}
          {renderButton('/', () => handleOperatorPress('/'), styles.operatorButton)}
          {renderButton('*', () => handleOperatorPress('*'), styles.operatorButton)}
          {renderButton('-', () => handleOperatorPress('-'), styles.operatorButton)}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderButton('7', () => handleNumberPress(7))}
          {renderButton('8', () => handleNumberPress(8))}
          {renderButton('9', () => handleNumberPress(9))}
          {renderButton('+', () => handleOperatorPress('+'), styles.operatorButton)}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderButton('4', () => handleNumberPress(4))}
          {renderButton('5', () => handleNumberPress(5))}
          {renderButton('6', () => handleNumberPress(6))}
          {renderButton('=', handleEquals, styles.equalsButton)}
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          {renderButton('1', () => handleNumberPress(1))}
          {renderButton('2', () => handleNumberPress(2))}
          {renderButton('3', () => handleNumberPress(3))}
          <View style={styles.button} />
        </View>

        {/* Row 5 */}
        <View style={styles.row}>
          {renderButton('0', () => handleNumberPress(0), styles.zeroButton)}
          {renderButton('.', handleDecimal)}
          <View style={styles.button} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  displayContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#1c1c1c',
  },
  displayText: {
    fontSize: 60,
    color: '#ffffff',
    fontWeight: '300',
  },
  buttonContainer: {
    flex: 5,
    padding: 10,
    backgroundColor: '#1c1c1c',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '400',
  },
  functionButton: {
    backgroundColor: '#505050',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  equalsButton: {
    backgroundColor: '#ff9500',
  },
  zeroButton: {
    flex: 2,
  },
});
