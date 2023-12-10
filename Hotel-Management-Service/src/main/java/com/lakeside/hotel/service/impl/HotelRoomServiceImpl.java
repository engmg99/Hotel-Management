package com.lakeside.hotel.service.impl;

import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;

import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lakeside.hotel.exception.PhotoRetrievalException;
import com.lakeside.hotel.exception.ResourceNotFoundException;
import com.lakeside.hotel.model.HotelRoom;
import com.lakeside.hotel.repository.HotelRoomRepo;
import com.lakeside.hotel.service.IRoomService;

@Service
public class HotelRoomServiceImpl implements IRoomService {

	private static final Logger log = LoggerFactory.getLogger(HotelRoomServiceImpl.class);
	@Autowired
	private HotelRoomRepo roomRepo;

	@Override
	public HotelRoom addNewRoom(MultipartFile file, String roomype, BigDecimal roomPrice) {
		try {
			HotelRoom room = new HotelRoom();
			room.setRoomType(roomype);
			room.setPrice(roomPrice);
			if (!file.isEmpty()) {
				byte[] photoBytes = file.getBytes();
				Blob photoBlob = new SerialBlob(photoBytes);
				room.setRoomPhoto(photoBlob);
			} else {
				room.setRoomPhoto(null);
			}
			return roomRepo.save(room);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public List<String> getAllRoomTypes() {
		return roomRepo.findDistinctRoomTypes();
	}

	@Override
	public List<HotelRoom> getAllAvailableRooms() {
		return roomRepo.findAll();
	}

	@Override
	public byte[] getRoomPhotoByRoomId(Long roomId) {
		try {
			Optional<HotelRoom> room = roomRepo.findById(roomId);
			if (room.isEmpty()) {
				throw new ResourceNotFoundException("Hotel Room Not Found!");
			}
			Blob photoBlob = room.get().getRoomPhoto();
			if (photoBlob != null) {
				return photoBlob.getBytes(1, (int) photoBlob.length());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public void deleteRoomById(Long roomId) {
		Optional<HotelRoom> room = roomRepo.findById(roomId);
		if (room.isPresent()) {
			roomRepo.deleteById(roomId);
		}
	}

	@Override
	public HotelRoom getRoomById(Long roomId) {
		Optional<HotelRoom> room = roomRepo.findById(roomId);
		if (room.isPresent()) {
			return room.get();
		}
		return null;
	}

	public byte[] convertBlobToBytes(HotelRoom roomObj) {
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

	public HotelRoom updateRoom(HotelRoom updatedRoomObj) {
		try {
			boolean isUpdated = false;
			HotelRoom oldRoomObj = roomRepo.findById(updatedRoomObj.getId())
					.orElseThrow(() -> new ResourceNotFoundException("Existing Room Not Found"));
			if (compareRoomType(oldRoomObj, updatedRoomObj)) {
				oldRoomObj.setRoomType(updatedRoomObj.getRoomType());
				isUpdated = true;
			}
			if (compareRoomPrice(oldRoomObj, updatedRoomObj)) {
				oldRoomObj.setPrice(updatedRoomObj.getPrice());
				isUpdated = true;
			}
			if (compareRoomPhoto(oldRoomObj, updatedRoomObj)) {
				oldRoomObj.setRoomPhoto(updatedRoomObj.getRoomPhoto());
				isUpdated = true;
			}
			if (isUpdated) {
				oldRoomObj = roomRepo.save(oldRoomObj);
			}
			return oldRoomObj;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private static boolean compareRoomType(HotelRoom oldData, HotelRoom updatedData) {
		if (oldData.getRoomType().equals(updatedData.getRoomType())) {
			log.info("Room type is not changed");
			return false;
		}
		log.info("Room type is changed from " + oldData.getRoomType() + " to " + updatedData.getRoomType());
		return true;
	}

	private static boolean compareRoomPrice(HotelRoom oldData, HotelRoom updatedData) {
		if (oldData.getPrice().compareTo(updatedData.getPrice()) == 0) {
			log.info("Room price is not changed");
			return false;
		}
		log.info("Room price is changed from " + oldData.getPrice() + " to " + updatedData.getPrice());
		return true;
	}

	private static boolean compareRoomPhoto(HotelRoom oldData, HotelRoom updatedData) {
		try {
			if (oldData.getRoomPhoto() != null && updatedData.getRoomPhoto() != null) {
				byte[] oldByte = oldData.getRoomPhoto().getBytes(1, (int) oldData.getRoomPhoto().length());
				String oldBase64Photo = Base64.encodeBase64String(oldByte);

				byte[] updatedByte = updatedData.getRoomPhoto().getBytes(1, (int) updatedData.getRoomPhoto().length());
				String updatedBase64Photo = Base64.encodeBase64String(updatedByte);

				if (oldBase64Photo.equals(updatedBase64Photo)) {
					log.info("Room Photo is not changed");
					return false;
				}
				log.info("Room Photo is changed from " + oldData.getRoomPhoto() + " to " + updatedData.getRoomPhoto());
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
}
