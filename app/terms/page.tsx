import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Условия использования',
  description: 'Черновая юридическая страница LI Studio. Финальная редакция будет собрана из text.md.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <main className='mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8'>
      <article className='rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8'>
        <h1 className='text-3xl font-semibold leading-tight sm:text-4xl'>Условия использования</h1>
        <p className='mt-4 text-zinc-300'>
          Страница оставлена как технический каркас. Финальная юридическая версия будет перенесена и
          отредактирована из раздела 12 и 13 файла text.md.
        </p>
      </article>
    </main>
  )
}
