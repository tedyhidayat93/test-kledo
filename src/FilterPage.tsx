import React from "react";
import {
  useLoaderData,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import { FaGlobeAmericas } from "react-icons/fa";

/* =========================
   TYPES
========================= */
interface Province {
  id: number;
  name: string;
}

interface Regency {
  id: number;
  name: string;
  province_id: number;
}

interface District {
  id: number;
  name: string;
  regency_id: number;
}

interface LoaderData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
}

interface LayoutProps {
  children: React.ReactNode;
}

interface SidebarProps {
  provinces: Province[];
  filteredRegencies: Regency[];
  filteredDistricts: District[];
  selectedProvince: string | null;
  selectedRegency: string | null;
  selectedDistrict: string | null;
  handleChange: (name: string, value: string) => void;
  handleReset: () => void;
}

interface BreadcrumbProps {
  selectedProvince: string | null;
  selectedRegency: string | null;
  selectedDistrict: string | null;
  provinceName: string;
  regencyName?: string;
  districtName?: string;
}

interface MainContentProps {
  provinceName: string;
  regencyName?: string;
  districtName?: string;
}

/* =========================
   DATA LOADER
========================= */
export async function loader(): Promise<LoaderData> {
  const res = await fetch("/data/indonesia_regions.json");

  if (!res.ok) {
    throw new Error("Gagal mengambil data wilayah");
  }

  return res.json();
}

/* =========================
   LAYOUT COMPONENT
========================= */
function Layout({ children }: LayoutProps): React.ReactElement {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row">
      {children}
    </div>
  );
}

/* =========================
   SIDEBAR COMPONENT
========================= */
function Sidebar({ 
  provinces, 
  filteredRegencies, 
  filteredDistricts, 
  selectedProvince, 
  selectedRegency, 
  selectedDistrict, 
  handleChange, 
  handleReset 
}: SidebarProps): React.ReactElement {
  return (
    <aside className="w-full lg:w-80 border-r border-gray-200 p-6 lg:p-8 flex flex-col">
      <h1 className="text-lg font-semibold mb-6 lg:mb-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <FaGlobeAmericas className="text-blue-500" />
        </div>
        Frontend Assessment
      </h1>

      <div className="space-y-4 lg:space-y-6 flex-1">
        <h2 className="text-xs font-semibold tracking-widest text-gray-400">
          FILTER WILAYAH
        </h2>

        <div>
          <label className="form-label">
            PROVINSI
          </label>
          <select
            name="province"
            value={selectedProvince || ""}
            onChange={(e) =>
              handleChange("province", e.target.value)
            }
            className="form-select"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">
            KOTA/KABUPATEN
          </label>
          <select
            name="regency"
            value={selectedRegency || ""}
            disabled={!selectedProvince}
            onChange={(e) =>
              handleChange("regency", e.target.value)
            }
            className="form-select"
          >
            <option value="">Pilih Kota/Kabupaten</option>
            {filteredRegencies.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">
            KECAMATAN
          </label>
          <select
            name="district"
            value={selectedDistrict || ""}
            disabled={!selectedRegency}
            onChange={(e) =>
              handleChange("district", e.target.value)
            }
            className="form-select"
          >
            <option value="">Pilih Kecamatan</option>
            {filteredDistricts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReset}
          className="reset-button"
        >
          RESET
        </button>
      </div>

    </aside>
  );
}

/* =========================
   BREADCRUMB COMPONENT
========================= */
function Breadcrumb({ 
  selectedProvince, 
  selectedRegency, 
  selectedDistrict, 
  provinceName, 
  regencyName, 
  districtName 
}: BreadcrumbProps): React.ReactElement {
  return (
    <div className="breadcrumb">
        <span className="whitespace-nowrap">Indonesia</span>

        {selectedProvince && provinceName && (
            <>
            <IoChevronForward className="text-xs flex-shrink-0" />
            <span className={`whitespace-nowrap ${selectedRegency && regencyName ? "" : "text-blue-400"}`}>{provinceName}</span>
            </>
        )}

        {selectedRegency && regencyName && (
            <>
            <IoChevronForward className="text-xs flex-shrink-0" />
            <span className={`whitespace-nowrap ${selectedDistrict && districtName ? "" : "text-blue-400"}`}>{regencyName}</span>
            </>
        )}

        {selectedDistrict && districtName && (
            <>
            <IoChevronForward className="text-xs flex-shrink-0" />
            <span className="text-blue-400 whitespace-nowrap">{districtName}</span>
            </>
        )}
    </div>
  );
}

/* =========================
   MAIN CONTENT COMPONENT
========================= */
function MainContent({ 
  provinceName, 
  regencyName, 
  districtName 
}: MainContentProps): React.ReactElement {
  return (
    <main className="main-content">
      <div className="content-container">
        {/* Province */}
        <div>
          <p className="location-label">
            PROVINSI
          </p>
          <h2 className="province-title">
            {provinceName}
          </h2>
        </div>

        {regencyName && (
          <div>
            <p className="location-label">
              KOTA / KABUPATEN
            </p>
            <h2 className="regency-title">
              {regencyName}
            </h2>
          </div>
        )}

        {districtName && (
          <div>
            <p className="location-label">
              KECAMATAN
            </p>
            <h2 className="district-title">
              {districtName}
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}

/* =========================
   HELPER FUNCTIONS
========================= */
function filterRegencies(regencies: Regency[], selectedProvince: string | null): Regency[] {
  return selectedProvince
    ? regencies.filter((r) => r.province_id === Number(selectedProvince))
    : [];
}

function filterDistricts(districts: District[], selectedRegency: string | null): District[] {
  return selectedRegency
    ? districts.filter((d) => d.regency_id === Number(selectedRegency))
    : [];
}

function getProvinceName(provinces: Province[], selectedProvince: string | null): string {
  return provinces.find((p) => p.id === Number(selectedProvince))?.name || "Indonesia";
}

function getRegencyName(filteredRegencies: Regency[], selectedRegency: string | null): string | undefined {
  return filteredRegencies.find((r) => r.id === Number(selectedRegency))?.name;
}

function getDistrictName(filteredDistricts: District[], selectedDistrict: string | null): string | undefined {
  return filteredDistricts.find((d) => d.id === Number(selectedDistrict))?.name;
}

/* =========================
   DEFAULT EXPORTED COMPONENT
========================= */
export default function FilterPage(): React.ReactElement {
  const { provinces, regencies, districts }: LoaderData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedProvince = searchParams.get("province");
  const selectedRegency = searchParams.get("regency");
  const selectedDistrict = searchParams.get("district");
  
  /* ================= FILTER DATA ================= */
  const filteredRegencies = filterRegencies(regencies, selectedProvince);
  const filteredDistricts = filterDistricts(districts, selectedRegency);
  
  const provinceName = getProvinceName(provinces, selectedProvince);
  const regencyName = getRegencyName(filteredRegencies, selectedRegency);
  const districtName = getDistrictName(filteredDistricts, selectedDistrict);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    if (name === "province") {
      params.delete("regency");
      params.delete("district");
    }

    if (name === "regency") {
      params.delete("district");
    }

    setSearchParams(params);
  };

  const handleReset = () => navigate("/");

  return (
    <Layout>
      <Sidebar 
        provinces={provinces}
        filteredRegencies={filteredRegencies}
        filteredDistricts={filteredDistricts}
        selectedProvince={selectedProvince}
        selectedRegency={selectedRegency}
        selectedDistrict={selectedDistrict}
        handleChange={handleChange}
        handleReset={handleReset}
      />
      
      <div className="flex-1 flex flex-col w-full">
        <Breadcrumb 
          selectedProvince={selectedProvince}
          selectedRegency={selectedRegency}
          selectedDistrict={selectedDistrict}
          provinceName={provinceName}
          regencyName={regencyName}
          districtName={districtName}
        />
        
        <MainContent 
          provinceName={provinceName}
          regencyName={regencyName}
          districtName={districtName}
        />
      </div>
    </Layout>
  );
}