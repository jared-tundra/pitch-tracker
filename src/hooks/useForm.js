// src/hooks/useForm.js
import { useState } from 'react';

const useForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return { email, setEmail, password, setPassword, error, setError };
};

export default useForm;
