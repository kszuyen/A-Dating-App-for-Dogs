type Props = {
  children: React.ReactNode;
};

function DogLayout({ children }: Props) {
  return (
    // overflow-hidden for parent to hide scrollbar
    <div className="mx-auto max-w-6xl">{children}</div>
  );
}

export default DogLayout;
