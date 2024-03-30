interface Props {
	children: React.ReactNode;
}

const Header = ({ children }: Props) => {
	return <h3 className="bg-blue-50 p-4 rounded-md shadow-md">{children}</h3>;
};

export default Header;
