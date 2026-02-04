import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { useUser } from '../../contexts/UserContext';
import styles from './Signup.module.css';

export function Signup() {
  const [inputValue, setInputValue] = useState('');
  const { setUsername } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUsername(inputValue.trim());
    }
  };

  const isButtonDisabled = inputValue.trim().length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to CodeLeap network!</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            id="username"
            label="Please enter your username"
            placeholder="John doe"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className={styles.buttonWrapper}>
            <Button type="submit" disabled={isButtonDisabled}>
              Enter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
