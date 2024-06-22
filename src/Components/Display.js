import React, { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Display = () => {
  const [courseData, setCourseData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [qualificationData, setQualificationData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [venueData, setVenueData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0); // State for managing active tab

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, "application/xml");
        const json = xmlToJson(xml);
        console.log(json.DataFutures);
        setCourseData(json.DataFutures.Course || []);
        setModuleData(json.DataFutures.Module || []);
        setQualificationData(json.DataFutures.Qualification || []);
        setSessionData(json.DataFutures.SessionYear || []);
        setStudentData(json.DataFutures.Student || []);
        setVenueData(json.DataFutures.Venue || []);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid XML file.");
    }
  };

  const xmlToJson = (xml) => {
    let obj = {};
    if (xml.nodeType === 1) {
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      obj = xml.nodeValue.trim();
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof obj[nodeName] === "undefined") {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };

  const formatValue = (value) => {
    if (typeof value === "object" && value !== null) {
      if (value["#text"]) {
        return value["#text"];
      }
      return JSON.stringify(value);
    }
    return value;
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <Container>
        <Grid>
          <h1>Upload XML File</h1>
          <Button
            color="success"
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          </Button>
        </Grid>

        {/* Tabs for switching between different tables */}
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Courses" />
          <Tab label="Modules" />
          <Tab label="Qualifications" />
          <Tab label="Sessions" />
          <Tab label="Students" />
          <Tab label="Venues" />
        </Tabs>

        {/* Display respective table based on the active tab */}
        {tabIndex === 0 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "lightgreen", color: "white" }}>
                <TableRow>
                  <TableCell>COURSEID</TableCell>
                  <TableCell>CLSDCRS</TableCell>
                  <TableCell>COURSETITLE</TableCell>
                  <TableCell>PREREQUISITE</TableCell>
                  <TableCell>QUALID</TableCell>
                  <TableCell>TTCID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatValue(row.COURSEID)}</TableCell>
                    <TableCell>{formatValue(row.CLSDCRS)}</TableCell>
                    <TableCell>{formatValue(row.COURSETITLE)}</TableCell>
                    <TableCell>{formatValue(row.PREREQUISITE)}</TableCell>
                    <TableCell>{formatValue(row.QUALID)}</TableCell>
                    <TableCell>{formatValue(row.TTCID)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabIndex === 1 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "lightgreen", color: "white" }}>
                <TableRow>
                  <TableCell>MODID</TableCell>
                  <TableCell>FTE</TableCell>
                  <TableCell>MTITLE</TableCell>
                  <TableCell>ModuleCostCentre COSTCN</TableCell>
                  <TableCell>ModuleCostCentre COSTCNPROPORTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {moduleData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatValue(row.MODID)}</TableCell>
                    <TableCell>{formatValue(row.FTE)}</TableCell>
                    <TableCell>{formatValue(row.MTITLE)}</TableCell>
                    <TableCell>
                      {formatValue(row.ModuleCostCentre.COSTCN)}
                    </TableCell>
                    <TableCell>
                      {formatValue(row.ModuleCostCentre.COSTCNPROPORTION)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabIndex === 2 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "lightgreen", color: "white" }}>
                <TableRow>
                  <TableCell>QUALCAT</TableCell>
                  <TableCell>QUALID</TableCell>
                  <TableCell>QUALTITLE</TableCell>
                  <TableCell>QualificationSubject QUALPROPORTION</TableCell>
                  <TableCell>QualificationSubject QUALSUBJECT</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qualificationData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatValue(row.QUALCAT)}</TableCell>
                    <TableCell>{formatValue(row.QUALID)}</TableCell>
                    <TableCell>{formatValue(row.QUALTITLE)}</TableCell>
                    <TableCell>
                      {formatValue(row.QualificationSubject.QUALPROPORTION)}
                    </TableCell>
                    <TableCell>
                      {formatValue(row.QualificationSubject.QUALSUBJECT)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabIndex === 3 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "lightgreen", color: "white" }}>
                <TableRow>
                  <TableCell>SESSIONYEARID</TableCell>
                  <TableCell>SYENDDATE</TableCell>
                  <TableCell>SYSTARTDATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessionData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatValue(row.SESSIONYEARID)}</TableCell>
                    <TableCell>{formatValue(row.SYENDDATE)}</TableCell>
                    <TableCell>{formatValue(row.SYSTARTDATE)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabIndex === 4 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "lightgreen", color: "white" }}>
                <TableRow>
                  <TableCell>SID</TableCell>
                  <TableCell>BIRTHDATE</TableCell>
                  <TableCell>FNAMES</TableCell>
                  <TableCell>GENDERID</TableCell>
                  <TableCell>NATION</TableCell>
                  <TableCell>OWNSTU</TableCell>
                  <TableCell>RELIGION</TableCell>
                  <TableCell>SEXID</TableCell>
                  <TableCell>SID</TableCell>
                  <TableCell>SURNAME</TableCell>
                  <TableCell>TTACCOM</TableCell>
                  <TableCell>TTPCODE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatValue(row.SID)}</TableCell>
                    <TableCell>{formatValue(row.BIRTHDTE)}</TableCell>
                    <TableCell>{formatValue(row.FNAMES)}</TableCell>
                    <TableCell>{formatValue(row.GENDERID)}</TableCell>
                    <TableCell>{formatValue(row.NATION)}</TableCell>
                    <TableCell>{formatValue(row.OWNSTU)}</TableCell>
                    <TableCell>{formatValue(row.RELIGION)}</TableCell>
                    <TableCell>{formatValue(row.SEXID)}</TableCell>
                    <TableCell>{formatValue(row.SID)}</TableCell>
                    <TableCell>{formatValue(row.SURNAME)}</TableCell>
                    <TableCell>{formatValue(row.TTACCOM)}</TableCell>
                    <TableCell>{formatValue(row.TTPCODE)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabIndex === 5 && (
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "lightgreen", color: "white" }}>
                <TableRow>
                  <TableCell>POSTCODE</TableCell>
                  <TableCell>VENUEID</TableCell>
                  <TableCell>VENUENAME</TableCell>
                  <TableCell>VENUEUKPRN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{formatValue(venueData.POSTCODE)}</TableCell>
                  <TableCell>{formatValue(venueData.VENUEID)}</TableCell>
                  <TableCell>{formatValue(venueData.VENUENAME)}</TableCell>
                  <TableCell>{formatValue(venueData.VENUEUKPRN)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
};
export default Display;
