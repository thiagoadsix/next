import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.sass';

export function SignInButton() {
  const isUserLoggedIn = true

  return isUserLoggedIn ? (
    <button
      className={styles.signInButton}
      type="button"
    >
      <FaGithub color='#04d361' />
      Thiago Andrade
      <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button
      className={styles.signInButton}
      type="button"
    >
      <FaGithub color='#eba418' />
      Sign in with GitHub
    </button>
  )
}
