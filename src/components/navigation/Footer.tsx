export default function Footer() {
  return (
    <footer className='border-t bg-background absolute bottom-0 w-full'>
      <div className=' px-6 py-4 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2'>
        <p>© {new Date().getFullYear()} AI StudyMate</p>
        <p>Built with care for students. Stay curious.</p>
      </div>
    </footer>
  );
}
