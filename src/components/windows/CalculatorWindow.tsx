"use client";

import { useEffect, useState } from "react";

type Operator = "+" | "-" | "×" | "÷";
type CalculatorButtonType = "number" | "operator" | "function" | "equals";

type CalculatorButton = {
  label: string;
  type: CalculatorButtonType;
  action: () => void;
};

const INITIAL_VALUE = "0";

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "Error";
  return Number(value.toFixed(10)).toString();
}

function runOperation(left: number, right: number, operator: Operator): number {
  if (operator === "+") return left + right;
  if (operator === "-") return left - right;
  if (operator === "×") return left * right;
  if (right === 0) return Number.NaN;
  return left / right;
}

export function CalculatorWindow() {
  const [displayValue, setDisplayValue] = useState(INITIAL_VALUE);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForNextValue, setWaitingForNextValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const addHistory = (line: string) => {
    setHistory((prev) => [...prev.slice(-9), line]);
  };

  const resetCalculator = () => {
    setDisplayValue(INITIAL_VALUE);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNextValue(false);
  };

  const inputDigit = (digit: string) => {
    if (displayValue === "Error") {
      setDisplayValue(digit);
      setWaitingForNextValue(false);
      return;
    }

    if (waitingForNextValue) {
      setDisplayValue(digit);
      setWaitingForNextValue(false);
      return;
    }

    setDisplayValue((prev) => (prev === INITIAL_VALUE ? digit : `${prev}${digit}`));
  };

  const inputDecimal = () => {
    if (displayValue === "Error") {
      setDisplayValue("0.");
      setWaitingForNextValue(false);
      return;
    }

    if (waitingForNextValue) {
      setDisplayValue("0.");
      setWaitingForNextValue(false);
      return;
    }

    setDisplayValue((prev) => (prev.includes(".") ? prev : `${prev}.`));
  };

  const backspace = () => {
    if (displayValue === "Error" || waitingForNextValue) {
      setDisplayValue(INITIAL_VALUE);
      setWaitingForNextValue(false);
      return;
    }
    setDisplayValue((prev) => (prev.length <= 1 ? INITIAL_VALUE : prev.slice(0, -1)));
  };

  const toggleSign = () => {
    if (displayValue === "Error" || displayValue === INITIAL_VALUE) return;
    setDisplayValue((prev) => (prev.startsWith("-") ? prev.slice(1) : `-${prev}`));
  };

  const percentage = () => {
    if (displayValue === "Error") return;
    const value = Number(displayValue);
    if (!Number.isFinite(value)) return;
    setDisplayValue(formatNumber(value / 100));
    setWaitingForNextValue(true);
  };

  const handleOperator = (nextOperator: Operator) => {
    if (displayValue === "Error") return;
    const currentValue = Number(displayValue);
    if (!Number.isFinite(currentValue)) {
      setDisplayValue("Error");
      return;
    }

    if (previousValue === null) {
      setPreviousValue(currentValue);
      setOperator(nextOperator);
      setWaitingForNextValue(true);
      return;
    }

    if (operator && !waitingForNextValue) {
      const result = runOperation(previousValue, currentValue, operator);
      if (!Number.isFinite(result)) {
        setDisplayValue("Error");
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNextValue(true);
        return;
      }
      const formatted = formatNumber(result);
      setDisplayValue(formatted);
      setPreviousValue(result);
      setOperator(nextOperator);
      setWaitingForNextValue(true);
      return;
    }

    setOperator(nextOperator);
    setWaitingForNextValue(true);
  };

  const calculateResult = () => {
    if (displayValue === "Error" || operator === null || previousValue === null) return;
    const currentValue = Number(displayValue);
    if (!Number.isFinite(currentValue)) {
      setDisplayValue("Error");
      return;
    }

    const result = runOperation(previousValue, currentValue, operator);
    if (!Number.isFinite(result)) {
      setDisplayValue("Error");
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNextValue(true);
      return;
    }

    const formatted = formatNumber(result);
    addHistory(`${formatNumber(previousValue)} ${operator} ${formatNumber(currentValue)} = ${formatted}`);
    setDisplayValue(formatted);
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNextValue(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        inputDigit(key);
        return;
      }

      if (key === ".") {
        event.preventDefault();
        inputDecimal();
        return;
      }

      if (key === "+" || key === "-") {
        event.preventDefault();
        handleOperator(key as Operator);
        return;
      }

      if (key === "*" || key === "x" || key === "X") {
        event.preventDefault();
        handleOperator("×");
        return;
      }

      if (key === "/") {
        event.preventDefault();
        handleOperator("÷");
        return;
      }

      if (key === "%") {
        event.preventDefault();
        percentage();
        return;
      }

      if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
        return;
      }

      if (key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }

      if (key === "Escape") {
        event.preventDefault();
        resetCalculator();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const buttons: CalculatorButton[] = [
    { label: "AC", type: "function", action: resetCalculator },
    { label: "±", type: "function", action: toggleSign },
    { label: "%", type: "function", action: percentage },
    { label: "⌫", type: "function", action: backspace },
    { label: "7", type: "number", action: () => inputDigit("7") },
    { label: "8", type: "number", action: () => inputDigit("8") },
    { label: "9", type: "number", action: () => inputDigit("9") },
    { label: "÷", type: "operator", action: () => handleOperator("÷") },
    { label: "4", type: "number", action: () => inputDigit("4") },
    { label: "5", type: "number", action: () => inputDigit("5") },
    { label: "6", type: "number", action: () => inputDigit("6") },
    { label: "×", type: "operator", action: () => handleOperator("×") },
    { label: "1", type: "number", action: () => inputDigit("1") },
    { label: "2", type: "number", action: () => inputDigit("2") },
    { label: "3", type: "number", action: () => inputDigit("3") },
    { label: "-", type: "operator", action: () => handleOperator("-") },
    { label: "0", type: "number", action: () => inputDigit("0") },
    { label: ".", type: "number", action: inputDecimal },
    { label: "=", type: "equals", action: calculateResult },
    { label: "+", type: "operator", action: () => handleOperator("+") },
  ];

  const getButtonClass = (type: CalculatorButtonType) => {
    if (type === "equals") {
      return "border-[0.5px] border-[var(--os-text)] bg-[var(--os-text)] text-[var(--os-background)] hover:opacity-90 active:opacity-80";
    }
    if (type === "operator") {
      return "border-[0.5px] border-[var(--os-border)] bg-[var(--os-hover)] text-[var(--os-text)] hover:bg-[var(--os-border)] active:opacity-85";
    }
    if (type === "function") {
      return "border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] text-[var(--os-text)] hover:bg-[var(--os-hover)] active:opacity-85";
    }
    return "border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] text-[var(--os-text)] hover:bg-[var(--os-hover)] active:opacity-85";
  };

  return (
    <div className="h-full overflow-auto px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="mb-4 max-h-28 overflow-auto rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-3">
          <p className="text-label mb-2 text-[var(--os-text-muted)]">History</p>
          {history.length === 0 ? (
            <p className="text-ui text-[var(--os-text-muted)]">No calculations yet.</p>
          ) : (
            <div className="space-y-1">
              {history.map((item, index) => (
                <p
                  key={`${item}-${index}`}
                  className="text-ui"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-4">
          <div
            className="mb-4 rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-4 py-3 text-right"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <p className="text-[clamp(36px,6vw,48px)] leading-none font-normal text-[var(--os-text)]">
              {displayValue}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buttons.map((button) => (
              <button
                key={button.label}
                type="button"
                onClick={button.action}
                className={`h-12 rounded-md text-sm font-medium transition-colors duration-150 ${getButtonClass(button.type)}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
