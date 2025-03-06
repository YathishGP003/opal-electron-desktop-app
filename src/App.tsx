import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ControlLayout from './layouts/ControlLayout';

import { Toaster } from 'sonner';
import './App.css'
import AuthButton from './components/Global/AuthButton';
import Widget from './components/Global/Widget';

const client = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={client}>
    <ControlLayout>
      <AuthButton />
      <Widget />
    </ControlLayout>
    <Toaster />
  </QueryClientProvider>
  )
}

export default App
