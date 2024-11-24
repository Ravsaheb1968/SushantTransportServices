//previw form send via email option.
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './TransportServiceForm.css';
const TransportServiceForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [billNumber] = useState(() => `BILL-${Math.floor(100000 + Math.random() * 900000)}`);
  const [previewData, setPreviewData] = useState(null);
  const previewRef = useRef(); // Reference for the preview section

  const handlePreview = () => {
    const currentData = {
      billNumber,
      ...watch(), // Capture current form data
    };
    setPreviewData(currentData);
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;

    // Desired resolution in DPI (Dots Per Inch)
    const dpi = 600; // Standard high-quality DPI for print
    const scaleFactor = dpi / 96; // 96 is the default DPI of most browsers

    // Set up options for high-quality canvas rendering
    const canvas = await html2canvas(previewRef.current, {
      scale: 9, // Increases the resolution of the canvas (2x the normal resolution)
      useCORS: true, // Ensures cross-origin images are rendered properly
    });

    const imgData = canvas.toDataURL('image/png'); // Get high-quality image data
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Calculate the dimensions for a better fit in the PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add the high-quality image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST'); // 'FAST' ensures quicker rendering with good quality
    // Generate a filename using the Biller Name
    const billerName = previewData.billerName.replace(/[^a-zA-Z0-9]/g, '_'); // Replace invalid characters with '_'
    const fileName = `${billerName}_${billNumber}.pdf`;

    pdf.save(fileName); // Save with the Biller Name as the filename
    // pdf.save(`${billNumber}.pdf`);
  };

  const sendEmail = (data) => {
    const templateParams = {
      billNumber,
      billerName: data.billerName,
      date: data.date,
      vehicleNumber: data.vehicleNumber,
      goodsDescription: data.goodsDescription,
      weight: data.weight,
      amount: data.amount,
      customerEmail: data.customerEmail, // Assuming this field is added for email
    };

    emailjs
      .send('service_buiolir', 'template_i1pu6wv', templateParams, 'tmLzpuoY6eW2-qLsi')
      .then(
        (response) => {
          console.log('Email sent successfully:', response.status, response.text);
          alert('Bill sent to the customer via email!');
        },
        (error) => {
          console.error('Failed to send email:', error);
          alert('Failed to send email. Please try again.');
        }
      );
  };

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    sendEmail(data); // Send email
    alert('Form submitted successfully!');
  };

  return (
    <div className="form-container">
      <h2>Billing System</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Auto-Generated Bill Number */}
        <div className="form-group">
          <label htmlFor="billNumber">Bill Number</label><br />
          <input
            id="billNumber"
            type="text"
            value={billNumber}
            readOnly
            {...register('billNumber')}
          />
        </div>

        {/* Sender/Biller Name */}
        <div className="form-group">
          <label htmlFor="billerName">Sender/Biller Name</label><br />
          <input
            id="billerName"
            type="text"
            {...register('billerName', { required: 'Biller name is required' })}
          />
          {errors.billerName && <p className="error">{errors.billerName.message}</p>}
        </div>

        {/* Customer Email */}
        <div className="form-group">
          <label htmlFor="customerEmail">Customer Email</label><br />
          <input
            id="customerEmail"
            type="email"
            {...register('customerEmail', { required: 'Customer email is required' })}
          />
          {errors.customerEmail && <p className="error">{errors.customerEmail.message}</p>}
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date</label><br />
          <input
            id="date"
            type="date"
            {...register('date', { required: 'Date is required' })}
          />
          {errors.date && <p className="error">{errors.date.message}</p>}
        </div>

        {/* Vehicle Number */}
        <div className="form-group">
          <label htmlFor="vehicleNumber">Vehicle Number</label><br />
          <input
            id="vehicleNumber"
            type="text"
            {...register('vehicleNumber', { required: 'Vehicle number is required' })}
          />
          {errors.vehicleNumber && <p className="error">{errors.vehicleNumber.message}</p>}
        </div>

        {/* Goods Description */}
        <div className="form-group">
          <label htmlFor="goodsDescription">Bill Description</label><br />
          <textarea
            id="goodsDescription"
            {...register('goodsDescription', { required: 'Goods description is required' })}
          ></textarea>
          {errors.goodsDescription && <p className="error">{errors.goodsDescription.message}</p>}
        </div>

        {/* Weight of Goods */}
        <div className="form-group">
          <label htmlFor="weight">Weight of Goods (kg)</label><br />
          <input
            id="weight"
            type="number"
            step="0.01"
            {...register('weight', { required: 'Weight is required', min: 0.1 })}
          />
          {errors.weight && <p className="error">{errors.weight.message}</p>}
        </div>

        {/* Amount to Pay */}
        <div className="form-group">
          <label htmlFor="amount">Amount to Pay (₹)</label><br />
          <input
            id="amount"
            type="number"
            step="0.01"
            {...register('amount', { required: 'Amount is required', min: 0 })}
          />
          {errors.amount && <p className="error">{errors.amount.message}</p>}
        </div>

        {/* Buttons */}
        <div className="form-group">
          <button type="button" onClick={handlePreview}>
            Preview & Download
          </button>
          <button type="submit">Submit & Send Email</button>
        </div>
      </form>

      {/* Preview Section */}
      {previewData && (
        <div>
          <div ref={previewRef} className="preview-container">
            <h1>Sushant Transport Services</h1>
            <h4>FLEET OWNERS & TRANSPORT CONTRACTORS</h4>
            <address>405,Shree Samarth HSG Soc.,Sector-22,Plot No:79,Kamothe,Navi Mumbai-410209
              <span> Mob:9323994795/9769479510 Email: sushantmule88@gmail.com</span>
            </address>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                margin: '20px 0',
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Bill Number</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.billNumber}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Biller Name</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.billerName}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Customer Email:</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.customerEmail}</td>
                  {/* <strong>Customer Email:</strong> {previewData.customerEmail} */}
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Date:</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.date}</td>
                  {/* <strong>Date:</strong> {previewData.date} */}
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Vehicle Number:</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.vehicleNumber}</td>
                  {/* <strong>Vehicle Number:</strong> {previewData.vehicleNumber} */}
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Bill Description:</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.goodsDescription}</td>
                  {/* <strong>Goods Description:</strong> {previewData.goodsDescription} */}
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Weight of Goods:</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.weight} Kg</td>
                  {/* <strong>Weight of Goods:</strong> {previewData.weight} kg */}
                </tr>
                <tr>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>Amount to Pay:</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{previewData.amount}</td>
                  {/* <strong>Amount to Pay:</strong> ₹{previewData.amount} */}
                </tr>
              </tbody>
            </table>

          </div>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default TransportServiceForm;
