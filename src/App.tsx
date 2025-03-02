import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ControlLayout from './layouts/ControlLayout';
import { Toaster } from 'sonner';
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
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
