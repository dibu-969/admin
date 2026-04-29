import { redirect } from 'next/navigation';

export default function RootPage() {
  // Melakukan redirect otomatis ke route /form
  redirect('/form');
}