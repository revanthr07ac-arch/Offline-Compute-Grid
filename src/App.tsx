import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import SplashScreen from './pages/auth/SplashScreen'
import AuthLoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import CreateAccountPage from './pages/auth/CreateAccountPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import DashboardPage from './pages/DashboardPage'
import DevicesPage from './pages/DevicesPage'
import DeviceDetailPage from './pages/DeviceDetailPage'
import TaskManagerPage from './pages/TaskManagerPage'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
import FileManagerPage from './pages/FileManagerPage'
import PerformancePage from './pages/PerformancePage'
import LogsPage from './pages/LogsPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import ErrorPage from './pages/ErrorPage'

type AuthScreen = 'splash' | 'login' | 'forgot' | 'create' | 'verify'

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('splash')
  const [loggedIn, setLoggedIn] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showCreateTask, setShowCreateTask] = useState(false)

  if (!loggedIn) {
    if (authScreen === 'splash') {
      return <SplashScreen onComplete={() => setAuthScreen('login')} />
    }
    if (authScreen === 'login') {
      return (
        <AuthLoginPage
          onLogin={() => setLoggedIn(true)}
          onForgotPassword={() => setAuthScreen('forgot')}
          onCreateAccount={() => setAuthScreen('create')}
        />
      )
    }
    if (authScreen === 'forgot') {
      return <ForgotPasswordPage onBack={() => setAuthScreen('login')} />
    }
    if (authScreen === 'create') {
      return (
        <CreateAccountPage
          onBack={() => setAuthScreen('login')}
          onCreated={() => {
            setPendingEmail('alex.kim@gridlab.local')
            setAuthScreen('verify')
          }}
        />
      )
    }
    if (authScreen === 'verify') {
      return (
        <VerifyEmailPage
          email={pendingEmail || 'you@example.com'}
          onVerified={() => setLoggedIn(true)}
          onBack={() => setAuthScreen('create')}
        />
      )
    }
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/devices"
              element={
                selectedDeviceId
                  ? <DeviceDetailPage deviceId={selectedDeviceId} onBack={() => setSelectedDeviceId(null)} />
                  : <DevicesPage onDeviceSelect={setSelectedDeviceId} />
              }
            />
            <Route
              path="/tasks"
              element={
                showCreateTask
                  ? (
                    <CreateTaskPage
                      onBack={() => setShowCreateTask(false)}
                      onSubmitted={(id) => { setShowCreateTask(false); setSelectedTaskId(id) }}
                    />
                  )
                  : selectedTaskId
                  ? <TaskDetailPage taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />
                  : (
                    <TaskManagerPage
                      onTaskSelect={setSelectedTaskId}
                      onCreateTask={() => setShowCreateTask(true)}
                    />
                  )
              }
            />
            <Route
              path="/create-task"
              element={
                <CreateTaskPage
                  onBack={() => window.history.back()}
                  onSubmitted={() => window.history.back()}
                />
              }
            />
            <Route path="/files" element={<FileManagerPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  )
}
