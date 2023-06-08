import { FormEventHandler, MouseEventHandler, useState } from "react";
import ReactModal from "react-modal";
import { signIn, useSession } from "next-auth/react";

interface Props {
	setToken?: () => void;
	modalOpen: boolean;
	onModalClose: () => void;
}

interface SignupCredentials {
	first_name: string;
	// username: 'testtesttesties';
	password: string;
	email: string;
	genres: string;
	streaming_service: string;
	cached_likes: string[];
	cached_dislikes: string[];
}

async function signupUser(credentials: SignupCredentials) {
	return fetch(`http://localhost:3005/api/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	})
		.then((res) => {
			console.log(res);
			if (res.ok) return res.json();
			throw new Error(res.statusText);
		})
		.catch((err) => {
			console.log(err);
		});
}

export function LoginModal({ setToken, modalOpen, onModalClose }: Props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [confirmText, setConfirmText] = useState('');
	const [isLogin, setIsLogin] = useState(true);

	const session = useSession();

	const flipSignUp = () => {
		setIsLogin(!isLogin);
	};

	const handleLogin: MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault();
		const res = await signIn("credentials", { redirect: false, email, password  });
		if (!res?.ok) {
			throw new Error(res?.error ?? "No response received from server.");
		}
		setEmail('');
		setPassword('');
		// if (token) {
			// console.log(email, password);
			clearModal();
			// props.setToken({ token: token });
			sessionStorage.removeItem('likes');
			sessionStorage.removeItem('dislikes');
			// props.setGenres(u)
		// } else {
		// 	setConfirmText('Email or password incorrect!');
		// }
	};

	const handleSignup: MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.preventDefault();

		if (password.length < 8) {
			setConfirmText(
				'Your password must be at least 8 characters long. Please try again.'
			);
			setPassword('');
			setConfirmPassword('');
		} else {
			if (password === confirmPassword) {
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				const cached_likes = sessionStorage.getItem('likes') ? JSON.parse(sessionStorage.getItem('likes') as string) : [];
				const cached_dislikes = sessionStorage.getItem('dislikes') ? JSON.parse(sessionStorage.getItem('dislikes') as string) : [];
				
				const user = await signupUser({
					first_name: 'test',
					// username: 'testtesttesties',
					password: password,
					email: email,
					genres: '',
					streaming_service: '',
					cached_likes: cached_likes,
					cached_dislikes: cached_dislikes
				}).catch((err) => console.error(err));

				if (!user) {
					setConfirmText('That email is already taken!');
					return;
				}

				sessionStorage.removeItem('likes');
				sessionStorage.removeItem('dislikes');

				// const res = await signIn("credentials", { redirect: false, email, password });

				// console.log(res);
				// console.log(session);

				// props.setToken({ token: token });
				clearModal();
				// props.closeModal();
			} else {
				setConfirmText('Passwords did not match! Please try again.');
				setPassword('');
				setConfirmPassword('');
			}
		}
	};

	const clearModal = () => {
		setConfirmText('');
		onModalClose();
	};

	// const isLogin = props.isLogin;

	// ReactModal.setAppElement('#root');

	if (isLogin) {
		return (
			<ReactModal
				isOpen={modalOpen}
				className='login-modal'
				overlayClassName='login-modal-overlay'
				onRequestClose={clearModal}
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
				style={{ overlay: { zIndex: 3 } }}>
				<h2 className='title-txt'>Log In</h2>
				<h3>{confirmText}</h3>
				<input
					className='modal-in'
					type='text'
					placeholder='Email'
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
				<input
					className='modal-in'
					type='password'
					placeholder='Password'
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				/>
				{/* <p>or</p> */}
				<button type="submit" onClick={handleLogin}>
					Submit
				</button>
				<h3>
					Dont have an account?
				</h3>
				<button className='submit-btn' onClick={flipSignUp}>
					Sign Up
				</button>
			</ReactModal>
		);
	}

	return (
		<ReactModal
			isOpen={modalOpen}
			className='login-modal'
			overlayClassName='login-modal-overlay'
			onRequestClose={clearModal}
			shouldCloseOnEsc={true}
			shouldCloseOnOverlayClick={true}
			style={{ overlay: { zIndex: 3 } }}>
			<h2 className='title-txt'>Sign Up</h2>
			<h3>{confirmText}</h3>
			<input
				className='modal-in'
				type='text'
				placeholder='Email'
				onChange={(e) => setEmail(e.target.value)}
				value={email}
			/>
			<input
				className='modal-in'
				type='password'
				placeholder='Password'
				onChange={(e) => setPassword(e.target.value)}
				value={password}
			/>
			<input
				className='modal-in'
				type='password'
				placeholder='Confirm Password'
				onChange={(e) => setConfirmPassword(e.target.value)}
				value={confirmPassword}
			/>
			{/* <p>or</p> */}
			<button className='submit-btn' onClick={handleSignup}>
				Submit
			</button>
			<h3>
				Already have an account?
			</h3>
			<button className='submit-btn' onClick={flipSignUp}>
				Log In
			</button>
		</ReactModal>
	);
}

export default LoginModal;