'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getErrorMessage } from '@/lib/utils/errorUtils'
import { validateNewPassword } from '@/lib/auth/validatePassword'
import { Loader2, Lock, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageToggle } from '@/components/LanguageToggle'

type Phase = 'checking' | 'ready' | 'invalid'

export default function ResetPasswordPage() {
    const [phase, setPhase] = useState<Phase>('checking')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const t = useTranslations('resetPassword')
    const tLogin = useTranslations('login')

    useEffect(() => {
        const supabase = createClient()
        if (!supabase) {
            setPhase('invalid')
            return
        }

        let resolved = false
        const markReady = () => {
            resolved = true
            setPhase('ready')
        }

        // O browser client processa o token da URL (detectSessionInUrl). Conforme o
        // fluxo (implicit #access_token ou PKCE ?code=), o evento pode ser
        // PASSWORD_RECOVERY ou SIGNED_IN — por isso aceitamos qualquer sessão
        // estabelecida, em vez de depender de um evento específico.
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) markReady()
        })

        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                markReady()
            } else {
                // Dar margem ao processamento/troca do token na URL antes de desistir.
                setTimeout(() => {
                    if (!resolved) setPhase((p) => (p === 'checking' ? 'invalid' : p))
                }, 2500)
            }
        })

        return () => sub.subscription.unsubscribe()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const validationError = validateNewPassword(password, confirm)
        if (validationError) {
            setError(t(validationError))
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            if (!supabase) {
                throw new Error(tLogin('errorNoSupabase'))
            }

            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error

            router.push('/dashboard')
        } catch (err) {
            setError(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-500/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-md w-full relative z-10 px-4">
                <div className="flex justify-end mb-4">
                    <LanguageToggle />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-display tracking-tight mb-2">
                        {t('title')}
                    </h1>
                </div>

                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
                    {phase === 'checking' && (
                        <div className="flex justify-center py-6">
                            <Loader2 className="animate-spin h-6 w-6 text-primary-500" />
                        </div>
                    )}

                    {phase === 'invalid' && (
                        <div className="text-center space-y-4">
                            <p className="text-slate-700 dark:text-slate-300 text-sm">
                                {t('invalidLink')}
                            </p>
                            <Link
                                href="/forgot-password"
                                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 transition-colors"
                            >
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                {t('requestNew')}
                            </Link>
                        </div>
                    )}

                    {phase === 'ready' && (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    {t('newPassword')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="new-password"
                                        name="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        aria-required="true"
                                        aria-describedby={error ? "reset-error" : undefined}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all sm:text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    {t('confirmPassword')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        aria-required="true"
                                        aria-describedby={error ? "reset-error" : undefined}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all sm:text-sm"
                                        placeholder="••••••••"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div
                                    id="reset-error"
                                    role="alert"
                                    aria-live="polite"
                                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center"
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    t('submit')
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
