package com.lakeside.hotel.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lakeside.hotel.exception.InvalidBookingRequestException;
import com.lakeside.hotel.model.HotelRoom;
import com.lakeside.hotel.service.IRoomService;
import com.lakeside.hotel.utils.ImageUtility;
import com.lakeside.hotel.wrapper.HotelRoomWrapper;

@RestController
@RequestMapping("/room")
@CrossOrigin("http://localhost:5173") // allowed CORS region for React server
public class HotelRoomController {

	@Autowired
	private IRoomService roomService;

	@PostMapping("/add/new-room")
	public ResponseEntity<HotelRoomWrapper> addNewRoom(@RequestParam("photo") MultipartFile photo,
			@RequestParam("roomType") String roomype, @RequestParam("roomPrice") BigDecimal roomPrice) {
		try {
			HotelRoom savedRoom = roomService.addNewRoom(photo, roomype, roomPrice);
			HotelRoomWrapper roomWrapper = getHotelRoomWrapper(savedRoom);
			return ResponseEntity.ok(roomWrapper);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@GetMapping("/get-room-types")
	public List<String> getRoomTypes() {
		return roomService.getAllRoomTypes();
	}

	@GetMapping("/all-rooms")
	public ResponseEntity<List<HotelRoomWrapper>> getAllAvailableRooms() {
		List<HotelRoomWrapper> response = new ArrayList<>();
		try {
			List<HotelRoom> roomsList = roomService.getAllAvailableRooms();
			for (HotelRoom roomObj : roomsList) {
				HotelRoomWrapper roomResponse = getHotelRoomWrapper(roomObj);
				byte[] photoBytes = roomService.getRoomPhotoByRoomId(roomObj.getId());
				roomResponse.setRoomPhoto(ImageUtility.base64Photo(photoBytes));
				response.add(roomResponse);
			}
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@DeleteMapping("delete/room/{roomId}")
	public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
		roomService.deleteRoomById(roomId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PutMapping("edit/room/{roomId}")
	public ResponseEntity<HotelRoomWrapper> updateRoom(@PathVariable Long roomId,
			@RequestParam(required = false) String roomType, @RequestParam(required = false) String roomPrice,
			@RequestParam(required = false) MultipartFile photo) {
		byte[] photoBytes = null;
		try {
			HotelRoom newRoomObject = new HotelRoom();
			newRoomObject.setId(roomId);
			newRoomObject.setPrice(roomPrice != null ? BigDecimal.valueOf(Long.parseLong(roomPrice)) : null);
			newRoomObject.setRoomType(roomType != null ? roomType : null);
			if (photo != null && !photo.isEmpty()) {
				photoBytes = photo.getBytes();
			}
			newRoomObject.setRoomPhoto(ImageUtility.convertBytesToBlob(photoBytes));

			HotelRoom updatedRoom = roomService.updateRoom(newRoomObject);
			HotelRoomWrapper roomWrapper = getHotelRoomWrapper(updatedRoom);
			return ResponseEntity.ok(roomWrapper);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@GetMapping("get/room/{roomId}")
	public ResponseEntity<HotelRoomWrapper> getRoomById(@PathVariable Long roomId) {
		try {
			HotelRoomWrapper roomWrapper = getHotelRoomWrapper(roomService.getRoomById(roomId));
			return ResponseEntity.ok(roomWrapper);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private HotelRoomWrapper getHotelRoomWrapper(HotelRoom roomObj) {
		try {
//			List<BookedRoom> bookings = getAllBookingsByRoomId(roomObj.getId());
//			System.out.println(bookings);
//			List<BookingWrapper> bookingInfo = bookings.stream()
//					.map(booking -> new BookingWrapper(booking.getBookingId(), booking.getCheckInDate(),
//							booking.getCheckOutDate(), booking.getBookingConfirmationCode()))
//					.toList();
			return new HotelRoomWrapper(roomObj.getId(), roomObj.getRoomType(), roomObj.getPrice(), roomObj.isBooked(),
					ImageUtility.convertBlobToBytes(roomObj));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

//	private List<BookedRoom> getAllBookingsByRoomId(Long id) {
//		return roomBookingService.getAllBookingsByRoomId(id);
//	}

	@GetMapping("/findRoomByDate")
	public ResponseEntity<?> getAvailableRooms(
			@RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
			@RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
			@RequestParam(required = true) String roomType) {
		try {
			List<HotelRoom> availableRooms = roomService.getAvailableRoomsByDate(checkInDate, checkOutDate, roomType);
			List<HotelRoomWrapper> roomResponse = new ArrayList<>();
			if (!availableRooms.isEmpty()) {
				for (HotelRoom room : availableRooms) {
					HotelRoomWrapper response = getHotelRoomWrapper(room);
					byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());
					response.setRoomPhoto(ImageUtility.base64Photo(photoBytes));
					roomResponse.add(response);
				}
			} else {
				return ResponseEntity.noContent().build();
			}
			return ResponseEntity.ok(roomResponse);
		} catch (InvalidBookingRequestException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
