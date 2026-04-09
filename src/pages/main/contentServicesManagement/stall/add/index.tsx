import BaseView from "@/components/base-view/BaseView";
import type { FormField } from "@/components/form-custom";
import FormCustom from "@/components/form-custom";
import type { StallCreateDto, StallDto, StallUpdateDto } from "@/dto/stall.dto";
import { useCreateStall } from "@/hooks/stall";
import { useSelectOwners } from "@/hooks/owner";
import { useRouter } from "@/routes/hooks";
import { Card, Form, Space, Tag, Typography, type FormInstance } from "antd";
import { Icon, type LatLngExpression, type LeafletMouseEvent } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { API_ENDPOINTS } from "@/services";
import "./index.css";

const DEFAULT_CENTER: LatLngExpression = [10.7769, 106.7009];

const isValidLatLng = (lat: number, lng: number) => {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

const locationMarkerIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type LocationMapPickerProps = {
  form?: FormInstance<Record<string, unknown>>;
  value?: { latitude?: number; longitude?: number };
  onChange?: (value: { latitude: number; longitude: number }) => void;
};

function LocationPicker({ onPick }: { onPick: (e: LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onPick,
  });

  return null;
}

function MapUpdater({ position }: { position?: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 220);

    return () => window.clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!position) return;
    if (!Array.isArray(position)) return;

    const [lat, lng] = position;

    if (!isValidLatLng(Number(lat), Number(lng))) {
      return;
    }

    try {
      map.flyTo([Number(lat), Number(lng)], 16, { duration: 0.8 });
    } catch {
      // Keep the modal usable even if the animation is rejected by the browser.
    }
  }, [map, position]);

  return null;
}

function LocationMapPicker({ form, value, onChange }: LocationMapPickerProps) {
  const formInstance = form as FormInstance<Record<string, unknown>>;
  const watchedLatitude = Form.useWatch("latitude", formInstance);
  const watchedLongitude = Form.useWatch("longitude", formInstance);

  const selectedPosition = useMemo<LatLngExpression | undefined>(() => {
    const latitude = Number(watchedLatitude ?? value?.latitude);
    const longitude = Number(watchedLongitude ?? value?.longitude);

    if (isValidLatLng(latitude, longitude)) {
      return [latitude, longitude];
    }

    return undefined;
  }, [value?.latitude, value?.longitude, watchedLatitude, watchedLongitude]);

  const mapCenter: LatLngExpression = selectedPosition
    ? selectedPosition
    : value?.latitude !== undefined &&
        value?.longitude !== undefined &&
        isValidLatLng(Number(value.latitude), Number(value.longitude))
      ? [Number(value.latitude), Number(value.longitude)]
      : DEFAULT_CENTER;

  const handlePickPosition = (e: LeafletMouseEvent) => {
    const latitude = Number(e.latlng.lat.toFixed(6));
    const longitude = Number(e.latlng.lng.toFixed(6));

    if (!isValidLatLng(latitude, longitude)) {
      return;
    }

    form?.setFieldsValue({ latitude, longitude });
    onChange?.({ latitude, longitude });
  };

  return (
    <Card className="stall-map-card" title="Chọn vị trí trên bản đồ">
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <div className="stall-map-summary">
          <Typography.Text type="secondary">
            Nhấn trực tiếp lên bản đồ để lấy tọa độ. Vĩ độ và kinh độ sẽ tự động cập nhật.
          </Typography.Text>
          <Tag color={selectedPosition ? "blue" : "default"}>
            {selectedPosition ? "Đã chọn vị trí" : "Chưa chọn vị trí"}
          </Tag>
        </div>

        <div className="stall-map-canvas">
          <span className="stall-map-badge">Chạm vào bản đồ để ghim vị trí</span>
          <MapContainer center={mapCenter} zoom={16} scrollWheelZoom className="stall-add-map">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains={["a", "b", "c", "d"]}
              maxZoom={20}
            />
            <MapUpdater position={selectedPosition} />
            <LocationPicker onPick={handlePickPosition} />
            {selectedPosition ? <Marker position={selectedPosition} icon={locationMarkerIcon} /> : null}
          </MapContainer>
        </div>
      </Space>
    </Card>
  );
}

export default function AddStallScreen({
  initData,
  title = "Thêm mới quán ăn",
  isEdit = false,
  handleUpdate,
  isLoadingUpdate,
}: {
  initData?: StallDto;
  isEdit?: boolean;
  handleUpdate?: (data: StallUpdateDto) => void;
  title?: string;
  isLoadingUpdate?: boolean;
}) {
  const { isLoading, onCreateStall } = useCreateStall();
  const { data: owners } = useSelectOwners();
  const router = useRouter();
  const ownerOptions = useMemo(
    () =>
      (owners ?? []).map((owner: { id: string; full_name: string }) => ({
        name: owner.full_name,
        id: owner.id,
      })),
    [owners],
  );

  const formFields = useMemo(() => {
    const fields: FormField[] = [
      {
        name: "owner_id",
        label: "Chủ quán",
        type: "select",
        required: true,
        placeholder: "Chọn chủ quán",
        options: ownerOptions,
      },
      {
        name: "name",
        label: "Tên quán ăn",
        type: "input",
        required: true,
        placeholder: "Nhập tên quán ăn",
        gridColumn: "1 / -1",
      },
      {
        name: "location_map",
        label: "Bản đồ vị trí",
        type: "custom",
        gridColumn: "1 / -1",
        customComponent: <LocationMapPicker />,
      },
      {
        name: "latitude",
        label: "Vĩ độ",
        type: "number",
        required: true,
        placeholder: "Tự động từ bản đồ",
        disabled: true,
      },
      {
        name: "longitude",
        label: "Kinh độ",
        required: true,
        type: "number",
        placeholder: "Tự động từ bản đồ",
        disabled: true,
      },
      {
        name: "radius",
        label: "Bán kính (m)",
        type: "number",
        required: false,
        placeholder: "Nhập bán kính",
        min: 0,
      },
      {
        name: "cover_image",
        label: "Ảnh bìa",
        type: "image",
        uploadEndpoint: API_ENDPOINTS.STALL.UPLOADIMAGE_GENERAL,
        required: false,
        placeholder: "Nhập URL ảnh bìa",
        isSingle: true,
      },
      {
        name: "category",
        label: "Danh mục",
        type: "input",
        required: false,
        placeholder: "Nhập danh mục",
      },
      {
        name: "price_range",
        label: "Khoảng giá",
        type: "input",
        required: false,
        placeholder: "Nhập khoảng giá",
      },
      {
        name: "opening_hours",
        label: "Giờ mở cửa",
        type: "textarea",
        required: false,
        placeholder: "Nhập giờ mở cửa",
        gridColumn: "1 / -1",
      },
      {
        name: "close_hours",
        label: "Giờ đóng cửa",
        type: "textarea",
        required: false,
        placeholder: "Nhập giờ đóng cửa",
        gridColumn: "1 / -1",
      },
      {
        name: "contact_phone",
        label: "Số điện thoại",
        type: "input",
        required: false,
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "website",
        label: "Website",
        type: "input",
        required: false,
        placeholder: "Nhập website",
      },
    ];

    return fields;
  }, [ownerOptions]);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isEdit) {
      if (handleUpdate) {
        handleUpdate(values as unknown as StallUpdateDto);
      }
    } else {
      onCreateStall(values as unknown as StallCreateDto);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <BaseView>
      <FormCustom
        title={title}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={goBack}
        submitText="Lưu"
        cancelText="Thoát"
        gap="18px"
        gridColumns="repeat(2, minmax(0, 1fr))"
      />
    </BaseView>
  );
}
