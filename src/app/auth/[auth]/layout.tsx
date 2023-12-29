type Props = {
  children: React.ReactNode;
};

function SigninLayout({ children }: Props) {
  return (
    // overflow-hidden for parent to hide scrollbar
    <>{children}</>
  );
}

export default SigninLayout;
