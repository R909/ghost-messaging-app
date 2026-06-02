const UserProfilePage =  async ({ params }: { params: Promise<{ slug: string |number }> }) => {
    const slug=(await params).slug;
    return (
        <div>
            <h1>Profile Page {slug}</h1>
        </div>
    );
}

export default UserProfilePage;