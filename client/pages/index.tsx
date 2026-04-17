import { useSession, signIn } from 'next-auth/react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Dashboard from '../components/Dashboard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Home() {
  const { status } = useSession()

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'authenticated') {
    return (
      <Layout>
        <Dashboard />
      </Layout>
    )
  }

  return <Landing />
}

function Landing() {
  const handleSignIn = () => signIn('google', { callbackUrl: '/' })

  const features = [
    {
      title: 'Track every application',
      desc: 'Log company, role, status, salary, location, and tech stack in one place — never lose track of where you applied.',
    },
    {
      title: 'Interview prep notebook',
      desc: 'Attach interview questions, answers, difficulty, and LeetCode links to each application for quick review.',
    },
    {
      title: 'Timeline visibility',
      desc: 'Capture applied, response, interview, and follow-up dates so you always know what needs attention this week.',
    },
    {
      title: 'Configurable views',
      desc: 'Show only the columns you care about — tech stack, work type, resume version, and more.',
    },
  ]

  return (
    <>
      <Head>
        <title>Job Application Tracker</title>
        <meta
          name="description"
          content="Track your job search from first application to offer — one dashboard, zero spreadsheets."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Job Application Tracker</h1>
          <button
            onClick={handleSignIn}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Sign in
          </button>
        </header>

        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Run your job search like a pro.
          </h2>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            One place for every application, interview note, and follow-up. Stop losing threads
            across spreadsheets, emails, and sticky notes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary-600 text-white text-sm font-medium shadow hover:bg-primary-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">Free, no credit card required.</p>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <h3 className="text-2xl font-semibold text-gray-900">Ready to get organized?</h3>
          <p className="mt-3 text-gray-600">
            Sign in with Google and start tracking in under a minute.
          </p>
          <button
            onClick={handleSignIn}
            className="mt-6 inline-flex items-center px-6 py-3 rounded-md bg-primary-600 text-white text-sm font-medium shadow hover:bg-primary-700 transition-colors"
          >
            Get started — it's free
          </button>
        </section>

        <footer className="border-t border-gray-200 py-8">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Job Application Tracker
          </p>
        </footer>
      </div>
    </>
  )
}
