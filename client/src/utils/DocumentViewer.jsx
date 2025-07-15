import React from "react";
import { Box, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import OutlookLogo from "../assets/outlook";
import ExelLogo from "../assets/ExelLogo";

function DocumentViewer({ attachment, key }) {

  function getFileNameFromPath(filePath) {
    // Normalize the path by replacing backslashes with forward slashes (if needed)
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Find the last index of '/' and extract the substring after it
    const lastSlashIndex = normalizedPath.lastIndexOf('/');
    return normalizedPath.substring(lastSlashIndex + 1);
  }

  const token = localStorage.getItem("token");

  const attachmentsUrl = `${import.meta.env.VITE_API_URL
    }/attachments/${getFileNameFromPath(attachment).replace(/ /g, '%20')}`;

  // console.log("url:", attachmentsUrl.replace(/ /g, '%20'), "attchment pth: ", getFileNameFromPath(attachment))

  const handleDownload = async () => {
    const filename = attachment.split("\\").pop();
    if (token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/attachments/${filename}`,
          {
            responseType: "blob",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename.split("/").pop()); // Set the file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // Check file types
  const isImage =
    attachment && attachment.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
  const isPDF = attachment && attachment.toLowerCase().endsWith(".pdf");
  const isWord = attachment && attachment.toLowerCase().endsWith(".docx");
  const isExcel =
    attachment && attachment.toLowerCase().match(/\.(xlsx|xls|csv)$/);
  const isAudio = attachment && attachment.toLowerCase().match(/\.(mp3|wav)$/);
  const isMsg = attachment && attachment.toLowerCase().endsWith(".msg");

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2} sx={{ mt: 2 }}>
      {/* Image Download */}
      {isImage && (
        <Button
          size="small"
          variant="contained"
          sx={{ alignSelf: "flex-end" }}
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
        >
          Download Image
        </Button>
      )}
      {/* Image Viewer */}
      {isImage && (
        <Box
          component="img"
          src={attachmentsUrl}
          alt="Attachment"
          sx={{
            maxWidth: "100%",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      )}

      {/* PDF Viewer */}
      {/* {isPDF && (
        <iframe
         
          src={attachmentsUrl}
          title="PDF Document"
          // sx={{
          //   width: "100%",
          //   height: "600px",
          //   border: "1px solid rgba(0, 0, 0, 0.1)",
          //   borderRadius: "10px",
          //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          // }}
        ></iframe>
      )} */}

      {isPDF && (
        <Button
          onClick={() => {
            const pdfUrl = attachmentsUrl; // Use the attachmentsUrl variable directly
            window.open(pdfUrl, "_blank"); // Open PDF in a new tab
          }}
          title="View PDF"
          variant="contained" // Optional: to apply MUI button styles
          sx={{ width: "100%", height: "auto", mt: 2 }} // Optional: add margin-top for spacing
        >
          View PDF
        </Button>
      )}

      {/* Word Document Viewer */}
      {isWord && (
        <Box
          component="iframe"
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            attachmentsUrl
          )}`}
          title="Word Document"
          sx={{
            width: "100%",
            height: "600px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        ></Box>
      )}

      {/* Excel Viewer / Download */}
      {isExcel && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <ExelLogo />
          <Button
            size="small"
            variant="contained"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
          >
            Download CSV/Excel
          </Button>
        </div>
      )}

      {/* Audio Player */}
      {isAudio && (
        <Box component="audio" controls sx={{ width: "100%", mt: 2 }}>
          <source src={attachmentsUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </Box>
      )}

      {/* .msg File Download */}
      {isMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <OutlookLogo />
          <Button
            size="small"
            variant="contained"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
          >
            Download .msg File
          </Button>
        </div>
      )}
    </Box>
  );
}

export default DocumentViewer;
