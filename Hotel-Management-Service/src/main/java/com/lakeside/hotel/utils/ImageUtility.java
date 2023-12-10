package com.lakeside.hotel.utils;

import java.sql.Blob;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.apache.tomcat.util.codec.binary.Base64;

import com.lakeside.hotel.exception.PhotoRetrievalException;
import com.lakeside.hotel.model.HotelRoom;

public class ImageUtility {
	public static byte[] convertBlobToBytes(HotelRoom roomObj) {
		byte[] photoByte = null;
		try {
			Blob photoBlob = roomObj.getRoomPhoto();
			if (photoBlob != null) {
				photoByte = photoBlob.getBytes(1, (int) photoBlob.length());
			}
		} catch (SQLException e) {
			throw new PhotoRetrievalException("Error fetching room photo");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return photoByte;
	}

	public static String base64Photo(byte[] photoBytes) {
		if (photoBytes != null && photoBytes.length > 0) {
			return Base64.encodeBase64String(photoBytes);
		}
		return null;
	}

	public static Blob convertBytesToBlob(byte[] photoBytes) throws SerialException, SQLException {
		return photoBytes != null && photoBytes.length > 0 ? new SerialBlob(photoBytes) : null;
	}
}
