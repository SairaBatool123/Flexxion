export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-3 mt-5">
      <div className="mx-auto px-4 flex justify-center items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} All rights reserved by
          <span className="font-semibold"> Saira Batool</span>
        </p>
      </div>
    </footer>
  );
}
