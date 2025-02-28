"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceToTextArea } from "@/components/voice-to-text-area";
import type { Clinic, User } from "@/types";
import {
  ArrowRightLeft,
  Building,
  Calendar,
  Cannabis,
  Check,
  HeartPulse,
  Home,
  Mic,
  MicOff,
  Pill,
  Scale,
  Stethoscope,
  UserCircle,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// --------------------------------------------------
// DATE SELECTOR (removes default browser icon)
// --------------------------------------------------

function DateSelector({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openDatepicker = () => {
    // First try showPicker method
    if (inputRef.current && typeof inputRef.current.showPicker === "function") {
      try {
        inputRef.current.showPicker();
        return;
      } catch (err) {
        console.log("showPicker not supported, falling back");
      }
    }

    // Fallback: focus and simulate click on the input
    if (inputRef.current) {
      inputRef.current.focus();

      // For browsers where focus doesn't trigger the picker
      const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      inputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date-input" className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative cursor-pointer" onClick={openDatepicker}>
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          id="date-input"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className={`
            pl-10
            appearance-none
            dark:bg-muted/40
            ${error ? "border-red-500" : ""}
            [&::-webkit-calendar-picker-indicator]:hidden
            [&::-webkit-inner-spin-button]:hidden
            [&::-webkit-clear-button]:hidden
          `}
          placeholder={placeholder}
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function CustomSelect({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  icon,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (selectedValue: string) => void;
  error?: string;
  placeholder?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`select-${label}`} className="text-sm font-medium">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={`select-${label}`}
          className={error ? "border-red-500" : ""}
        >
          <div className="flex items-center gap-2">
            {icon}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option, idx) => (
            <SelectItem key={idx} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// --------------------------------------------------
// TEXT DESCRIPTIONS FOR EACH CATEGORY
// --------------------------------------------------
function HousingText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">
          Little concern about housing stability (0-2)
        </p>
        <p>Own my home, Has a lease (short or long-term)</p>
      </div>
      <div>
        <p className="font-semibold">
          Minor concern about housing stability (3-4)
        </p>
        <p>
          Rent month-to-month, Don't have my own place yet, but I have something
          planned and the rent is affordable, Looking for my own place
        </p>
      </div>
      <div>
        <p className="font-semibold">
          Some concerns about housing stability (5-7)
        </p>
        <p>
          Not looking for my own place but I am comfortable, Have somewhere to
          stay but it is short-term, Rent/lease/mortgage and utilities are
          unaffordable
        </p>
      </div>
      <div>
        <p className="font-semibold">
          Serious concerns about housing stability (8-10)
        </p>
        <p>
          Housing is high-risk given house-mates, Have been staying in shelters,
          Homeless
        </p>
      </div>
    </div>
  );
}

function DosingText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">Little concern about dosing (0-2)</p>
        <p>
          0 doses missed, 1 or 2 doses were missed for understandable reasons
        </p>
      </div>
      <div>
        <p className="font-semibold">Minor concern about dosing (4)</p>
        <p>3 or 4 doses missed</p>
      </div>
      <div>
        <p className="font-semibold">Very concerned about dosing (6-8)</p>
        <p>5 or 6 doses missed (6), 7 or 8 doses missed (8)</p>
      </div>
      <div>
        <p className="font-semibold">Serious concerns about dosing (10)</p>
        <p>9 or more doses missed</p>
      </div>
    </div>
  );
}

function DrugsText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">Little concerns (0-1)</p>
        <p>
          No illicit substances for two years. Exception - one THC or Alcohol
          positive Screen
        </p>
      </div>
      <div>
        <p className="font-semibold">Minor concerns (2-4)</p>
        <p>
          No illicit substances for one year or nine months. Exception - one THC
          or Alcohol positive Screen
        </p>
      </div>
      <div>
        <p className="font-semibold">Some concerns (5-6)</p>
        <p>No illicit substances for six months or three months.</p>
      </div>
      <div>
        <p className="font-semibold">Serious concerns (7-10)</p>
        <p>
          Less than 3 months of negative drug screens for illicit THC, Alcohol,
          opioids or illicit benzodiazepines
        </p>
      </div>
    </div>
  );
}

function CounselingText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">Little concerns (0-2)</p>
        <p>No more than 1 session missed; attends group consistently</p>
      </div>
      <div>
        <p className="font-semibold">Minor concerns (3-5)</p>
        <p>Missed 2 or 3 sessions; attends group consistently</p>
      </div>
      <div>
        <p className="font-semibold">Some concerns (6-8)</p>
        <p>Missed 3 or 4 sessions; inconsistent group attendance</p>
      </div>
      <div>
        <p className="font-semibold">Serious concerns (10)</p>
        <p>Missed 4 or more sessions</p>
      </div>
    </div>
  );
}

function PhysicalText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">Little concerns (0-2)</p>
        <p>
          I have no physical or mental health issues, or they are managed
          without medication.
        </p>
      </div>
      <div>
        <p className="font-semibold">Minor concerns (3-6)</p>
        <p>
          My medical or mental health issues are managed with medication or
          require attention but do not affect my recovery effort
        </p>
      </div>
      <div>
        <p className="font-semibold">Some concerns (7-8)</p>
        <p>I have medical or mental health issues that impede my recovery</p>
      </div>
      <div>
        <p className="font-semibold">Serious concerns (9-10)</p>
        <p>
          My medical and mental health issues are not managed and cause me to
          consume illicit drugs
        </p>
      </div>
    </div>
  );
}

function LegalText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">Little concerns (0)</p>
        <p>No known legal issues</p>
      </div>
      <div>
        <p className="font-semibold">Minor concerns (2-4)</p>
        <p>
          My issues are managed and cannot result in jail time, or I am on
          probation but in good standing
        </p>
      </div>
      <div>
        <p className="font-semibold">Some concerns (5-8)</p>
        <p>
          I have legal issues and adequate representation, but an unfavorable
          outcome could result in jail time, or I do not have adequate
          representation
        </p>
      </div>
      <div>
        <p className="font-semibold">Serious concerns (9-10)</p>
        <p>
          I have warrants or I am involved with a current case that can result
          in jail time
        </p>
      </div>
    </div>
  );
}

function RelationshipsText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">Little concern - Maintenance (0-3)</p>
        <p>
          All family and friends are supportive and respect boundaries, Most
          family and friends support boundaries, Some individuals violate
          boundaries, but I manage these relationships, A variety of good,
          stable relationships
        </p>
      </div>
      <div>
        <p className="font-semibold">Minor concerns (4-6)</p>
        <p>
          Relationships are a challenge but working on it, Relationships often
          feel out of balance (conflict, boundaries, etc.), and Not satisfied
          with relationships. Relationships do not threaten my recovery
        </p>
      </div>
      <div>
        <p className="font-semibold">Some concerns (7-8)</p>
        <p>
          Finding it hard to get the support that I need, Relationships are
          fraught with tension and hurt, and Relationships threaten my recovery.
        </p>
      </div>
      <div>
        <p className="font-semibold">Serious concerns (9-10)</p>
        <p>
          Relationships with others are poor, Isolated with no stable or
          supportive relationships, Relationships threaten my recovery.
        </p>
      </div>
    </div>
  );
}

function MedicationText() {
  return (
    <div className="text-sm text-muted-foreground space-y-2 mt-2">
      <div>
        <p className="font-semibold">No concerns - Maintenance Phase (0)</p>
        <p>
          Continuous treatment for 2 years, Illicit drug-free for 6 months
          [Phase III], No Benzodiazepines
        </p>
      </div>
      <div>
        <p className="font-semibold">Little concerns (1-4)</p>
        <p>
          Continuous treatment for 2 years or 6 months, Illicit drug-free for
          6-9 months, with or without Benzodiazepine script
        </p>
      </div>
      <div>
        <p className="font-semibold">Some concerns (5-8)</p>
        <p>
          Continuous treatment for at least 3 months or 30 days; illicit-free
          for 3 months [Phase II] or stable dose
        </p>
      </div>
      <div>
        <p className="font-semibold">Serious concerns (9-10)</p>
        <p>Induction phase, dose not stable, increasing</p>
      </div>
    </div>
  );
}

// --------------------------------------------------
// DATA FETCHES
// --------------------------------------------------
async function fetchUsers(setUsers: (users: User[]) => void) {
  try {
    const response = await fetch("/api/getNPIs");
    const data: User[] = await response.json();
    if (response.ok) {
      setUsers(data);
    } else {
      console.error(data);
    }
  } catch (error) {
    console.error("Failed to fetch users", error);
  }
}

async function fetchClinics(setClinics: (clinics: Clinic[]) => void) {
  try {
    const response = await fetch("/api/getClinics");
    const data: Clinic[] = await response.json();
    if (response.ok) {
      setClinics(data);
    } else {
      console.error(data);
    }
  } catch (error) {
    console.error("Failed to fetch clinics", error);
  }
}

async function fetchPatients(setPatients: (patients: string[]) => void) {
  try {
    const response = await fetch("/api/getPatients");
    const data: string[] = await response.json();
    if (response.ok) {
      setPatients(data);
    } else {
      console.error(data);
    }
  } catch (error) {
    console.error("Failed to fetch patients", error);
  }
}

// --------------------------------------------------
// VALIDATION
// --------------------------------------------------
type FormValues = {
  selectedClinic: string;
  selectedNpi: string;
  selectedPatient: string;
};

type FormErrors = {
  selectedClinic?: string;
  selectedNpi?: string;
  selectedPatient?: string;
  date?: string;
  housingNote?: string;
  dosingNote?: string;
  drugsNote?: string;
  counselingNote?: string;
  physicalNote?: string;
  legalNote?: string;
  relationshipsNote?: string;
  medicationNote?: string;
  rgNote?: string;
};

function validateForm(values: FormValues): FormErrors {
  const { selectedClinic, selectedNpi, selectedPatient } = values;
  const errors: FormErrors = {};

  if (!selectedClinic) {
    errors.selectedClinic = "Please select a clinic.";
  }
  if (!selectedNpi) {
    errors.selectedNpi = "Please select an NPI.";
  }
  if (!selectedPatient) {
    errors.selectedPatient = "Please select a client.";
  }

  return errors;
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------
export default function SubmitR3() {
  const [users, setUsers] = useState<null | User[]>(null);
  const [clinics, setClinics] = useState<null | Clinic[]>(null);
  const [patients, setPatients] = useState<string[]>([]);

  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedNpi, setSelectedNpi] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [housingScore, setHousingScore] = useState(5);
  const [housingNote, setHousingNote] = useState("");

  const [dosingScore, setDosingScore] = useState(5);
  const [dosingNote, setDosingNote] = useState("");

  const [drugsScore, setDrugsScore] = useState(5);
  const [drugsNote, setDrugsNote] = useState("");

  const [counselingScore, setCounselingScore] = useState(5);
  const [counselingNote, setCounselingNote] = useState("");

  const [physicalScore, setPhysicalScore] = useState(5);
  const [physicalNote, setPhysicalNote] = useState("");

  const [legalScore, setLegalScore] = useState(5);
  const [legalNote, setLegalNote] = useState("");

  const [relationshipsScore, setRelationshipsScore] = useState(5);
  const [relationshipsNote, setRelationshipsNote] = useState("");

  const [medicationScore, setMedicationScore] = useState(5);
  const [medicationNote, setMedicationNote] = useState("");

  const [rgScore, setRgScore] = useState(10);
  const [rgNote, setRgNote] = useState("");
  const [rgAnswers, setRgAnswers] = useState<boolean[]>(Array(10).fill(false));

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Which step (tab) is currently active?
  const [activeTab, setActiveTab] = useState("tab1");

  // ----------------------------
  // STEP-BY-STEP VALIDATION
  // ----------------------------
  function validateStepOne() {
    const newErrors: FormErrors = {};
    if (!housingNote.trim()) {
      newErrors.housingNote = "Notes for Housing can't be empty.";
    }
    if (!dosingNote.trim()) {
      newErrors.dosingNote = "Notes for Dosing can't be empty.";
    }
    if (!drugsNote.trim()) {
      newErrors.drugsNote = "Notes for Drugs can't be empty.";
    }
    return newErrors;
  }

  function validateStepTwo() {
    const newErrors: FormErrors = {};
    if (!counselingNote.trim()) {
      newErrors.counselingNote = "Notes for Counseling can't be empty.";
    }
    if (!physicalNote.trim()) {
      newErrors.physicalNote = "Notes for Physical can't be empty.";
    }
    if (!legalNote.trim()) {
      newErrors.legalNote = "Notes for Legal can't be empty.";
    }
    return newErrors;
  }

  function validateStepThree() {
    const newErrors: FormErrors = {};
    if (!medicationNote.trim()) {
      newErrors.medicationNote = "Notes for Medication can't be empty.";
    }
    if (!relationshipsNote.trim()) {
      newErrors.relationshipsNote = "Notes for Relationships can't be empty.";
    }
    if (!rgNote.trim()) {
      newErrors.rgNote = "Notes for Restore Gap can't be empty.";
    }
    return newErrors;
  }

  function handleNext() {
    let stepErrors: FormErrors = {};
    if (activeTab === "tab1") {
      stepErrors = validateStepOne();
      if (Object.keys(stepErrors).length === 0) {
        setActiveTab("tab2");
      } else {
        setFormErrors((prev) => ({ ...prev, ...stepErrors }));
      }
    } else if (activeTab === "tab2") {
      stepErrors = validateStepTwo();
      if (Object.keys(stepErrors).length === 0) {
        setActiveTab("tab3");
      } else {
        setFormErrors((prev) => ({ ...prev, ...stepErrors }));
      }
    }
  }

  function handleBack() {
    if (activeTab === "tab2") {
      setActiveTab("tab1");
    } else if (activeTab === "tab3") {
      setActiveTab("tab2");
    }
  }

  // ----------------------------
  // FINAL SUBMISSION
  // ----------------------------
  const handleSubmit = async () => {
    const stepThreeErrors = validateStepThree();
    if (Object.keys(stepThreeErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...stepThreeErrors }));
      setErrorMessage("Please fix the errors before submitting.");
      setShowErrorDialog(true);
      return;
    }

    // Check required fields (clinic, npi, patient)
    const mainFieldErrors = validateForm({
      selectedClinic,
      selectedNpi,
      selectedPatient,
    });
    if (Object.keys(mainFieldErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...mainFieldErrors }));
      setErrorMessage("Please fill in all required fields.");
      setShowErrorDialog(true);
      return;
    }

    // No issues -> proceed
    setFormErrors({});
    const formData = {
      date,
      selectedPatient,
      selectedClinic,
      selectedNpi,
      housingScore,
      dosingScore,
      drugsScore,
      counselingScore,
      physicalScore,
      legalScore,
      relationshipsScore,
      medicationScore,
      housingNote,
      dosingNote,
      drugsNote,
      counselingNote,
      physicalNote,
      legalNote,
      relationshipsNote,
      medicationNote,
      rgNote,
    };

    try {
      const response = await fetch("/api/submitR3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setShowSuccessDialog(true);
      } else {
        setErrorMessage(result.message || "Submission failed");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("An error occurred while submitting.");
      setShowErrorDialog(true);
    }
  };

  // ----------------------------
  // DATA LOADING
  // ----------------------------
  useEffect(() => {
    fetchUsers(setUsers);
    fetchClinics(setClinics);
    fetchPatients(setPatients);
  }, []);

  return (
    <div className="min-h-screen pb-14 overflow-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">R3 Recovery Index</h1>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomSelect
                label="Select a Clinic"
                options={clinics ? clinics.map((c) => c.id.toString()) : []}
                value={selectedClinic}
                onChange={(val) => setSelectedClinic(val)}
                error={formErrors.selectedClinic}
                placeholder="-- Select a Clinic --"
                icon={<Building className="h-4 w-4" />}
              />

              <CustomSelect
                label="Select an NPI"
                options={users ? users.map((u) => u.npi) : []}
                value={selectedNpi}
                onChange={(val) => setSelectedNpi(val)}
                error={formErrors.selectedNpi}
                placeholder="-- Select an NPI --"
                icon={<UserCircle className="h-4 w-4" />}
              />

              <CustomSelect
                label="Select a Client Identifier"
                options={patients ? patients : []}
                value={selectedPatient}
                onChange={(val) => setSelectedPatient(val)}
                error={formErrors.selectedPatient}
                placeholder="-- Select a Client --"
                icon={<UserRound className="h-4 w-4" />}
              />

              <DateSelector
                label="Date review performed"
                value={date}
                onChange={(val) => setDate(val)}
                error={formErrors.date}
                placeholder="yyyy-mm-dd"
              />
            </div>
          </CardContent>
        </Card>

        {/* 
          Tabs remain visible but only the active one is clickable.
          The others look disabled.
        */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 flex flex-wrap gap-2 h-auto">
            <TabsTrigger
              value="tab1"
              disabled={activeTab !== "tab1"}
              className="flex-1 min-w-[200px]"
            >
              Housing, Dosing & Drugs
            </TabsTrigger>
            <TabsTrigger
              value="tab2"
              disabled={activeTab !== "tab2"}
              className="flex-1 min-w-[200px]"
            >
              Counseling, Physical & Legal
            </TabsTrigger>
            <TabsTrigger
              value="tab3"
              disabled={activeTab !== "tab3"}
              className="flex-1 min-w-[200px]"
            >
              Medications, Relationships & RG
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tab1" className="space-y-8 mt-4">
            <FormSection
              name="housing"
              icon={<Home className="h-5 w-5" />}
              Description={HousingText}
              score={housingScore}
              setScore={setHousingScore}
              note={housingNote}
              setNote={setHousingNote}
              error={formErrors.housingNote}
              setFormErrors={setFormErrors}
            />

            <FormSection
              name="dosing"
              icon={<Pill className="h-5 w-5" />}
              Description={DosingText}
              score={dosingScore}
              setScore={setDosingScore}
              note={dosingNote}
              setNote={setDosingNote}
              error={formErrors.dosingNote}
              setFormErrors={setFormErrors}
            />

            <FormSection
              name="drugs"
              icon={<Cannabis className="h-5 w-5" />}
              Description={DrugsText}
              score={drugsScore}
              setScore={setDrugsScore}
              note={drugsNote}
              setNote={setDrugsNote}
              error={formErrors.drugsNote}
              setFormErrors={setFormErrors}
            />
          </TabsContent>

          <TabsContent value="tab2" className="space-y-8 mt-4">
            <FormSection
              name="counseling"
              icon={<UserRound className="h-5 w-5" />}
              Description={CounselingText}
              score={counselingScore}
              setScore={setCounselingScore}
              note={counselingNote}
              setNote={setCounselingNote}
              error={formErrors.counselingNote}
              setFormErrors={setFormErrors}
            />

            <FormSection
              name="physical"
              icon={<HeartPulse className="h-5 w-5" />}
              Description={PhysicalText}
              score={physicalScore}
              setScore={setPhysicalScore}
              note={physicalNote}
              setNote={setPhysicalNote}
              error={formErrors.physicalNote}
              setFormErrors={setFormErrors}
            />

            <FormSection
              name="legal"
              icon={<Scale className="h-5 w-5" />}
              Description={LegalText}
              score={legalScore}
              setScore={setLegalScore}
              note={legalNote}
              setNote={setLegalNote}
              error={formErrors.legalNote}
              setFormErrors={setFormErrors}
            />
          </TabsContent>

          <TabsContent value="tab3" className="space-y-8 mt-4">
            <FormSection
              name="medication"
              icon={<Stethoscope className="h-5 w-5" />}
              Description={MedicationText}
              score={medicationScore}
              setScore={setMedicationScore}
              note={medicationNote}
              setNote={setMedicationNote}
              error={formErrors.medicationNote}
              setFormErrors={setFormErrors}
            />

            <FormSection
              name="relationships"
              icon={<Users className="h-5 w-5" />}
              Description={RelationshipsText}
              score={relationshipsScore}
              setScore={setRelationshipsScore}
              note={relationshipsNote}
              setNote={setRelationshipsNote}
              error={formErrors.relationshipsNote}
              setFormErrors={setFormErrors}
            />

            <RgFormSection
              answers={rgAnswers}
              setAnswers={setRgAnswers}
              score={rgScore}
              setScore={setRgScore}
              note={rgNote}
              setNote={setRgNote}
              error={formErrors.rgNote}
              setFormErrors={setFormErrors}
            />
          </TabsContent>
        </Tabs>

        {/* STEP NAVIGATION */}
        {activeTab === "tab1" && (
          <div className="mt-8 flex justify-end">
            <Button onClick={handleNext} size="lg">
              Next
            </Button>
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handleBack} size="lg">
              Back
            </Button>
            <Button onClick={handleNext} size="lg">
              Next
            </Button>
          </div>
        )}
        {activeTab === "tab3" && (
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handleBack} size="lg">
              Back
            </Button>
            <Button onClick={handleSubmit} size="lg">
              Submit
            </Button>
          </div>
        )}

        <AlertDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Submission Successful
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your R3 assessment has been successfully submitted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Submission Failed
              </AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Try Again</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

// --------------------------------------------------
// FORM SECTION - clears error on note change
// --------------------------------------------------
function FormSection({
  name,
  icon,
  Description,
  score,
  setScore,
  note,
  setNote,
  error,
  setFormErrors,
}: {
  name: string;
  icon: React.ReactNode;
  Description: () => React.ReactNode;
  score: number;
  setScore: Function;
  note: string;
  setNote: Function;
  error?: string;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const capsName = name[0].toUpperCase() + name.slice(1);

  const handleStartDictation = useCallback(() => {
    setIsRecording(!isRecording);
  }, [isRecording]);

  // When note changes, if there was an error, clear it if user typed something
  const handleNoteChange = useCallback(
    (value: string) => {
      setNote(value);
      if (error && value.trim()) {
        setFormErrors((prev) => ({
          ...prev,
          [`${name}Note`]: undefined,
        }));
      }
    },
    [setNote, error, name, setFormErrors]
  );

  return (
    <Card id={name} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-xl font-semibold">{capsName}</h2>
        </div>

        <Description />

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor={`${name}-slider`} className="text-sm font-medium">
                {`${capsName} score: ${score}`}
              </Label>
              <span className="text-sm text-muted-foreground">
                {score <= 2
                  ? "Little concern"
                  : score <= 4
                  ? "Minor concern"
                  : score <= 7
                  ? "Some concerns"
                  : "Serious concerns"}
              </span>
            </div>
            <Slider
              id={`${name}-slider`}
              defaultValue={[5]}
              min={0}
              max={10}
              step={1}
              value={[score]}
              onValueChange={(val) => setScore(val[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${name}-note`} className="text-sm font-medium">
                Notes
              </Label>
              <Button
                type="button"
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                className="h-8 px-3 gap-1"
                onClick={handleStartDictation}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>
            <VoiceToTextArea
              id={name}
              name={name}
              value={note}
              onChange={handleNoteChange}
              endpointUrl="/api/convertSpeech"
              placeholder="Speak or type notes here..."
              className="min-h-[100px] resize-none dark:bg-muted/40"
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------
// RESTORE GAP SECTION - clears error on note change
// --------------------------------------------------
function RgFormSection({
  answers,
  setAnswers,
  score,
  setScore,
  note,
  setNote,
  error,
  setFormErrors,
}: {
  answers: boolean[];
  setAnswers: (answers: boolean[]) => void;
  score: number;
  setScore: (score: number) => void;
  note: string;
  setNote: (note: string) => void;
  error?: string;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}) {
  const [isRecording, setIsRecording] = useState(false);

  const questions = [
    "Do you have enough money to buy what you need?",
    "Do you feel that you are doing well in treatment?",
    "Do you have adequate transportation?",
    "Do you have a hobby?",
    "Do you feel confident in your level of education?",
    "Do you have access to technology that supports your treatment (phone/wifi/tablet)?",
    "Are you independent in your life?",
    "Do you feel safe?",
    "Do your family and friends treat you with respect?",
    "Do you engage in self-care?",
  ];

  const handleAnswerChange = (index: number, value: boolean) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
    // Score is how many are "No"
    setScore(updatedAnswers.filter((response) => !response).length);
  };

  const handleStartDictation = useCallback(() => {
    setIsRecording(!isRecording);
  }, [isRecording]);

  const handleNoteChange = useCallback(
    (value: string) => {
      setNote(value);
      if (error && value.trim()) {
        setFormErrors((prev) => ({
          ...prev,
          rgNote: undefined,
        }));
      }
    },
    [setNote, error, setFormErrors]
  );

  return (
    <Card id="rg" className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Restore Gap</h2>
        </div>

        <div className="mt-4 space-y-6">
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="p-4 bg-muted/40 rounded-lg">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">{question}</Label>
                  <RadioGroup
                    className="flex gap-4"
                    value={answers[index] ? "yes" : "no"}
                    onValueChange={(val) =>
                      handleAnswerChange(index, val === "yes")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`yes-${index}`} />
                      <Label htmlFor={`yes-${index}`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`no-${index}`} />
                      <Label htmlFor={`no-${index}`}>No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">RG Score:</Label>
              <span className="text-lg font-semibold">{score}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {score <= 3
                ? "Little concern"
                : score <= 5
                ? "Minor concern"
                : score <= 8
                ? "Some concerns"
                : "Serious concerns"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rg-note" className="text-sm font-medium">
                Notes
              </Label>
              <Button
                type="button"
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                className="h-8 px-3 gap-1"
                onClick={handleStartDictation}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>
            <VoiceToTextArea
              id="rg"
              name="rg"
              value={note}
              onChange={handleNoteChange}
              endpointUrl="/api/convertSpeech"
              placeholder="Speak or type notes here..."
              className="min-h-[100px] resize-none dark:bg-muted/40"
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
