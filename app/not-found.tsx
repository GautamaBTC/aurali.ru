import Link from 'next/link'

export default function NotFound() {
  return (
    <main className='mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-start justify-center gap-5 px-4 py-14 sm:px-6 lg:px-8'>
      <p className='text-sm uppercase tracking-[0.16em] text-zinc-400'>404</p>
      <h1 className='text-3xl font-semibold leading-tight sm:text-4xl'>Страница не найдена</h1>
      <p className='max-w-xl text-zinc-300'>
        Раздел отсутствует или был перемещен во время подготовки нового лендинга LI Studio.
      </p>
      <Link
        href='/'
        className='inline-flex rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-700'
      >
        На главную
      </Link>
    </main>
  )
}
