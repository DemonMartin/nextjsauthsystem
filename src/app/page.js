import GoToButton from '@/components/buttons/GoToButton'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GoToButton to="Login" href="/login"/>
    </main>
  )
}
