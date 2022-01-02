import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import { signIn, signOut, useSession } from 'next-auth/react'

import styles from './styles.module.sass';

export function SignInButton() {
  const { data } = useSession()

  return data ? (
    <button
      className={styles.signInButton}
      type="button"
    >
      <FaGithub color='#04d361' />
      {data.user.name}
      <FiX
        color='#737380'
        className={styles.closeIcon}
        onClick={() => signOut()} 
      />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type="button"
      onClick={() => signIn('github')}
    >
      <FaGithub color='#eba418' />
      Sign in with GitHub
    </button>
  )
}
