import NavBar from '@/components/NavBar';
// import useToken from '@/components/Hooks/useToken';
import { SessionProvider } from './providers';
import DiscoverPage from '@/components/DiscoverPage';

function Home() {
  console.log("HOME");
  return (
    <main>
      <SessionProvider>
        <div className="flex flex-col h-screen">
          <NavBar />
          <DiscoverPage />
        </div>
      </SessionProvider>
    </main>
  )
}

export default Home;
