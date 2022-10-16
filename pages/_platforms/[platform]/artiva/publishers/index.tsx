import AdminLayout from "@/admin/AdminLayout";
//import PublisherPlacard from "@/admin/publishers/PublisherPlacard";

const Publishers = () => {
  return (
    <AdminLayout>
      <div className="p-6 px-10">
        <h1 className="text-3xl font-bold">Publishers</h1>

        <div className="mt-8">
          {/**
           *           {KNOWN_PUBLISHERS.map((x, i) => (
            <PublisherPlacard key={i} publisher={x} />
          ))}
           */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Publishers;
