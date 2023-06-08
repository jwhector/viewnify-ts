import NavBar from '@/components/NavBar';
// import useToken from '@/components/Hooks/useToken';
import { SessionProvider } from './providers';

function Home() {

  return (
    <main>
      <SessionProvider>
        <NavBar />
      </SessionProvider>
    </main>
  )
}

export default Home;
